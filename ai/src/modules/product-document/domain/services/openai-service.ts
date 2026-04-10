import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions';
import axios from 'axios';

/** Callback map keyed by tool/function name. Each callback receives parsed args and returns a string result. */
export type ToolExecutorMap = Record<string, (args: Record<string, any>) => Promise<string>>;

export interface ChatWithToolsResult {
  message: string;
  /** Names of tools that were actually invoked during the conversation. */
  calledTools: string[];
}

@Injectable()
export class OpenAIService {
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      baseURL: this.configService.get<string>('openai.baseUrl'),
      apiKey: this.configService.get<string>('openai.apiKey'),
    });
  }

  /**
   * Generate a text document from product data using chat completion.
   */
  public async generateDocument(prompt: string): Promise<string> {
    const model = this.configService.get<string>('openai.model') ?? 'gpt-4o-mini';

    const response = await this.client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `Bạn là chuyên gia mô tả món ăn cho hệ thống AI recommendation.
Hãy tạo một đoạn mô tả tự nhiên, dễ hiểu, dùng cho AI embedding bằng tiếng Việt cho sản phẩm dựa trên thông tin được cung cấp.
Đoạn mô tả phải bao gồm:
- Tên sản phẩm
- Mô tả chi tiết hương vị, thành phần nổi bật
- Mức giá
- Thời gian chuẩn bị (nếu có)
- Lượng calo (nếu có)
- Tags/nhãn (nếu có)
- Phù hợp với đối tượng/dịp nào

Yêu cầu:
- Viết tiếng Việt
- Giữ văn phong tự nhiên như nhân viên nhà hàng
- Không bịa thông tin không có
- Không thêm giải thích

Trả về dạng plain text, không markdown, không bullet point. Viết thành một đoạn văn mạch lạc, tự nhiên.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });

    return response.choices[0]?.message?.content?.trim() ?? '';
  }

  /**
   * Generate embedding vector using Hugging Face Inference API (free).
   */
  public async generateEmbedding(text: string): Promise<number[]> {
    const hfModel = this.configService.get<string>('huggingface.embeddingModel') ?? 'sentence-transformers/all-MiniLM-L6-v2';
    const hfToken = this.configService.get<string>('huggingface.apiToken');

    const url = ` https://router.huggingface.co/hf-inference/models/${hfModel}/pipeline/feature-extraction`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (hfToken) {
      headers['Authorization'] = `Bearer ${hfToken}`;
    }

    const response = await axios.post(url, { inputs: text, options: { wait_for_model: true } }, { headers });

    // HF returns number[] directly for single input
    return response.data as number[];
  }

  /**
   * Chat with tool-calling support.
   * The model decides autonomously whether to invoke the provided tools.
   *
   * @param systemPrompt  – system message that sets the assistant's behaviour
   * @param userMessage   – the current user message
   * @param conversationHistory – previous turns
   * @param tools         – OpenAI tool definitions the model may call
   * @param toolExecutors – a map of function-name → async handler that executes
   *                        the tool and returns a string result
   * @param maxToolRounds – safety cap on tool-call rounds to avoid infinite loops
   */
  public async chatWithTools(
    systemPrompt: string,
    userMessage: string,
    conversationHistory: { role: string; content: string }[],
    tools: ChatCompletionTool[],
    toolExecutors: ToolExecutorMap,
    maxToolRounds = 5,
  ): Promise<ChatWithToolsResult> {
    const model = this.configService.get<string>('openai.model') ?? 'gpt-4o-mini';

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];

    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({ role: msg.role as 'user' | 'assistant', content: msg.content });
      }
    }

    const lastHistoryMsg = recentHistory[recentHistory.length - 1];
    if (!lastHistoryMsg || lastHistoryMsg.content !== userMessage || lastHistoryMsg.role !== 'user') {
      messages.push({ role: 'user', content: userMessage });
    }

    // ── Agentic loop — let the model call tools until it produces a final text reply
    const calledTools: string[] = [];

    for (let round = 0; round < maxToolRounds; round++) {
      const response = await this.client.chat.completions.create({
        model,
        messages,
        tools,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const choice = response.choices[0];
      const assistantMessage = choice.message;

      // Append the assistant's message (may contain tool_calls)
      messages.push(assistantMessage);

      // If the model does NOT want to call any tool → return final answer
      if (choice.finish_reason !== 'tool_calls' || !assistantMessage.tool_calls?.length) {
        return {
          message: assistantMessage.content?.trim() ?? 'Xin lỗi, tôi không thể trả lời lúc này.',
          calledTools,
        };
      }

      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type !== 'function') continue;

        const fnName = toolCall.function.name;
        const fnArgs = JSON.parse(toolCall.function.arguments);

        console.log(`[OpenAIService] Model called tool "${fnName}" with args:`, fnArgs);
        calledTools.push(fnName);

        const executor = toolExecutors[fnName];
        let result: string;
        if (executor) {
          result = await executor(fnArgs);
        } else {
          result = JSON.stringify({ error: `Unknown tool: ${fnName}` });
        }

        // Feed the tool result back into the conversation
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: result,
        });
      }
      // Loop back → model will see the tool results and decide next step
    }

    // Safety: if we exhaust maxToolRounds, do one final call without tools
    const finalResponse = await this.client.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return {
      message: finalResponse.choices[0]?.message?.content?.trim() ?? 'Xin lỗi, tôi không thể trả lời lúc này.',
      calledTools,
    };
  }
}
