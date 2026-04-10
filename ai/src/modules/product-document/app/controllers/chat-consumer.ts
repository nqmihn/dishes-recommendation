import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ChatRecommendUsecase, ChatRecommendRequest } from '../../domain/usecases/chat-recommend-usecase';

@Controller()
export class ChatConsumer {
  constructor(
    private readonly chatRecommendUsecase: ChatRecommendUsecase,
  ) {}

  @MessagePattern('chat.recommend')
  async handleChatRecommend(
    @Payload() data: ChatRecommendRequest,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log(`[ChatConsumer] Received chat.recommend: "${data.message?.substring(0, 100)}..."`);
      const result = await this.chatRecommendUsecase.call(data);
      console.log(`[ChatConsumer] Recommendation generated successfully`);
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      console.error(`[ChatConsumer] Error processing chat.recommend:`, error);
      channel.ack(originalMsg);
      return {
        message: 'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.',
        products: [],
      };
    }
  }
}
