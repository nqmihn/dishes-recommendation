import { Injectable } from '@nestjs/common';
import { OpenAIService, ToolExecutorMap } from '../services/openai-service';
import { ProductDocumentRepository } from '../repositories/product-document-repository';
import { ProductDocumentModel } from '../models/product-document-model';
import type { ChatCompletionTool } from 'openai/resources/chat/completions';

export interface ChatRecommendRequest {
  message: string;
  conversation_history: { role: string; content: string }[];
}

export interface ChatRecommendResponse {
  message: string;
  products: {
    product_id: string;
    product_name: string;
    metadata?: Record<string, any>;
  }[];
}

/** Tool definitions exposed to the model */
const TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_menu_items',
      description:
        'Tìm kiếm các món ăn trong thực đơn dựa trên mô tả. ' +
        'Sử dụng khi khách hàng hỏi về món ăn, muốn gợi ý, hoặc tìm món phù hợp với yêu cầu cụ thể.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'Câu truy vấn mô tả món ăn cần tìm, ví dụ: "món cay Hàn Quốc", "đồ ăn nhẹ giá rẻ", "phở bò"',
          },
          limit: {
            type: 'number',
            description: 'Số lượng kết quả tối đa cần trả về (mặc định 5)',
          },
        },
        required: ['query'],
      },
    },
  },
];

const SYSTEM_PROMPT = `Bạn là trợ lý gợi ý món ăn thân thiện và am hiểu ẩm thực.
Nhiệm vụ của bạn là trò chuyện với khách hàng và gợi ý các món ăn phù hợp.

Bạn có quyền truy cập công cụ "search_menu_items" để tìm kiếm món ăn trong thực đơn.
- Khi khách hàng hỏi về món ăn, muốn gợi ý, hoặc cần tìm món phù hợp → hãy gọi tool để tìm kiếm.
- Khi khách hàng chỉ chào hỏi, hỏi chung chung, hoặc nói chuyện phiếm → trả lời trực tiếp, không cần gọi tool.
- Có thể gọi tool nhiều lần nếu cần tìm kiếm với các tiêu chí khác nhau.

Quy tắc:
- Chỉ gợi ý các món ăn có trong kết quả tìm kiếm
- Trả lời bằng tiếng Việt, thân thiện, tự nhiên như nhân viên phục vụ
- Nếu không tìm thấy món phù hợp, hãy khéo léo gợi ý thử tìm với từ khóa khác
- Có thể hỏi thêm về sở thích, khẩu vị, ngân sách để gợi ý tốt hơn
- Trả lời ngắn gọn, dễ hiểu, không quá dài dòng
- Khi gợi ý, nêu tên món và lý do phù hợp`;

@Injectable()
export class ChatRecommendUsecase {
  constructor(
    private readonly openAIService: OpenAIService,
    private readonly productDocumentRepository: ProductDocumentRepository,
  ) {}

  public async call(request: ChatRecommendRequest): Promise<ChatRecommendResponse> {
    const { message, conversation_history } = request;

    const foundProducts: ProductDocumentModel[] = [];

    const toolExecutors: ToolExecutorMap = {
      search_menu_items: async (args: Record<string, any>) => {
        const query = args.query as string;
        const limit = (args.limit as number) ?? 5;

        console.log(`[ChatRecommend] Tool "search_menu_items" called with query: "${query}", limit: ${limit}`);

        const embedding = await this.openAIService.generateEmbedding(query);
        console.log(`[ChatRecommend] Embedding generated (${embedding.length} dimensions)`);

        const similarDocs = await this.productDocumentRepository.findSimilar(embedding, limit);
        console.log(`[ChatRecommend] Found ${similarDocs.length} similar products`);

        for (const doc of similarDocs) {
          if (!foundProducts.some((p) => p.productId === doc.productId)) {
            foundProducts.push(doc);
          }
        }

        if (similarDocs.length === 0) {
          return 'Không tìm thấy món ăn nào phù hợp với yêu cầu.';
        }

        return similarDocs
          .map((doc, i) => `[${i + 1}] ${doc.productName}: ${doc.document}`)
          .join('\n\n');
      },
    };

    const result = await this.openAIService.chatWithTools(
      SYSTEM_PROMPT,
      message,
      conversation_history,
      TOOLS,
      toolExecutors,
    );

    console.log(`[ChatRecommend] Tools called: [${result.calledTools.join(', ')}]`);

    const products = foundProducts.map((doc) => ({
      product_id: doc.productId,
      product_name: doc.productName,
      metadata: doc.metadata,
    }));

    return {
      message: result.message,
      products,
    };
  }
}
