import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { v7 as uuidv7 } from 'uuid';
import { ChatSessionRepository } from '../repositories/chat-session-repository';
import { ChatMessageRepository } from '../repositories/chat-message-repository';
import { ChatSessionModel } from '../models/chat-session-model';
import { ChatMessageModel } from '../models/chat-message-model';
import { ProductRepository } from 'src/modules/product/domain/repositories/product-repository';

export const AI_CHAT_CLIENT = 'AI_CHAT_CLIENT';

export interface ChatResponse {
  session_token: string;
  message: string;
  products?: any[];
}

@Injectable()
export class SendChatMessageUsecase {
  constructor(
    private readonly chatSessionRepository: ChatSessionRepository,
    private readonly chatMessageRepository: ChatMessageRepository,
    private readonly productRepository: ProductRepository,
    @Inject(AI_CHAT_CLIENT) private readonly aiClient: ClientProxy,
  ) {}

  public async call(sessionToken: string | undefined, userMessage: string): Promise<ChatResponse> {
    const now = new Date();

    let session: ChatSessionModel;
    if (sessionToken) {
      const existing = await this.chatSessionRepository.findBySessionToken(sessionToken);
      if (existing) {
        session = existing;
      } else {
        session = await this.createSession(sessionToken, now);
      }
    } else {
      const newToken = uuidv7();
      session = await this.createSession(newToken, now);
    }

    const userMsg = new ChatMessageModel(uuidv7(), session.id, 'user', userMessage, undefined, now);
    await this.chatMessageRepository.create(userMsg);

    const history = await this.chatMessageRepository.findBySessionId(session.id, 20);
    const conversationHistory = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    let aiResponse: { message: string; products?: { product_id: string; product_name: string; metadata?: Record<string, any> }[] };
    try {
      aiResponse = await lastValueFrom(
        this.aiClient
          .send('chat.recommend', {
            message: userMessage,
            conversation_history: conversationHistory,
          })
          .pipe(timeout(30000)),
      );
    } catch (error) {
      console.error('[SendChatMessage] AI service error:', error);
      aiResponse = {
        message: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.',
        products: [],
      };
    }

    let productsWithDetail: any[] = [];
    if (aiResponse.products && aiResponse.products.length > 0) {
      const productIds = aiResponse.products.map((p) => p.product_id);
      const productModels = await this.productRepository.findManyByIds(productIds);

      const productMap = new Map(productModels.map((p) => [p.id, p]));
      productsWithDetail = aiResponse.products
        .map((aiProduct) => {
          const dbProduct = productMap.get(aiProduct.product_id);
          if (!dbProduct) return null;
          return {
            ...dbProduct.toJson(),
            ai_metadata: aiProduct.metadata,
          };
        })
        .filter(Boolean);
    }

    const assistantMsg = new ChatMessageModel(
      uuidv7(),
      session.id,
      'assistant',
      aiResponse.message,
      productsWithDetail.length > 0 ? { products: productsWithDetail } : undefined,
      new Date(),
    );
    await this.chatMessageRepository.create(assistantMsg);

    await this.chatSessionRepository.updateLastMessageAt(session.id, new Date());

    return {
      session_token: session.sessionToken,
      message: aiResponse.message,
      products: productsWithDetail,
    };
  }

  private async createSession(token: string, now: Date): Promise<ChatSessionModel> {
    const session = new ChatSessionModel(uuidv7(), token, undefined, now, now, now);
    return this.chatSessionRepository.create(session);
  }
}
