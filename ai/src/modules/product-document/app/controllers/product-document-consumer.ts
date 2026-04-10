import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { GenProductDocumentUsecase, ProductPayload } from '../../domain/usecases/gen-product-document-usecase';
import { ProductDocumentRepository } from '../../domain/repositories/product-document-repository';

@Controller()
export class ProductDocumentConsumer {

  constructor(
    private readonly genProductDocumentUsecase: GenProductDocumentUsecase,
    private readonly productDocumentRepository: ProductDocumentRepository,
  ) {}

  @MessagePattern('product.created')
  async handleProductCreated(
    @Payload() data: ProductPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log(`[ProductDocumentConsumer] Received product.created: ${data.name} (${data.id})`);
      const result = await this.genProductDocumentUsecase.call(data);
      console.log(`[ProductDocumentConsumer] Document generated and saved for product: ${result.productName}`);
      channel.ack(originalMsg);
    } catch (error) {
      console.error(`[ProductDocumentConsumer] Error processing product.created:`, error);
      // Negative acknowledge - requeue the message for retry
      channel.nack(originalMsg, false, true);
    }
  }

  @MessagePattern('product.updated')
  async handleProductUpdated(
    @Payload() data: ProductPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log(`[ProductDocumentConsumer] Received product.updated: ${data.name} (${data.id})`);
      const result = await this.genProductDocumentUsecase.call(data);
      console.log(`[ProductDocumentConsumer] Document re-generated and saved for product: ${result.productName}`);
      channel.ack(originalMsg);
    } catch (error) {
      console.error(`[ProductDocumentConsumer] Error processing product.updated:`, error);
      channel.nack(originalMsg, false, false);
    }
  }

  @MessagePattern('product.deleted')
  async handleProductDeleted(
    @Payload() data: { id: string; name: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log(`[ProductDocumentConsumer] Received product.deleted: ${data.name} (${data.id})`);
      const existing = await this.productDocumentRepository.findByProductId(data.id);
      if (existing) {
        await this.productDocumentRepository.delete(existing.id);
        console.log(`[ProductDocumentConsumer] Document deleted for product: ${data.name}`);
      } else {
        console.log(`[ProductDocumentConsumer] No document found for product: ${data.id}, skipping`);
      }
      channel.ack(originalMsg);
    } catch (error) {
      console.error(`[ProductDocumentConsumer] Error processing product.deleted:`, error);
      channel.nack(originalMsg, false, true);
    }
  }
}
