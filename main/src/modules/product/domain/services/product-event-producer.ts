import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductModel } from '../models/product-model';
import { lastValueFrom } from 'rxjs';

export const AI_QUEUE_CLIENT = 'AI_QUEUE_CLIENT';

export interface ProductEventPayload {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  base_price: number;
  thumbnail_url?: string;
  is_active: boolean;
  is_featured: boolean;
  preparation_time?: number;
  calories?: number;
  tags?: string[];
  sort_order: number;
  category_name?: string;
}

@Injectable()
export class ProductEventProducer implements OnModuleInit {
  constructor(
    @Inject(AI_QUEUE_CLIENT) private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('[ProductEventProducer] Connected to AI RabbitMQ queue');
    } catch (error) {
      console.warn('[ProductEventProducer] Failed to connect to AI RabbitMQ queue:', error);
    }
  }

  /**
   * Emit product.created event to AI queue.
   */
  public async emitProductCreated(product: ProductModel, categoryName?: string): Promise<void> {
    const payload = this.buildPayload(product, categoryName);
    try {
      this.client.emit('product.created', payload);
      console.log(`[ProductEventProducer] Emitted product.created: ${product.name} (${product.id})`);
    } catch (error) {
      console.error(`[ProductEventProducer] Failed to emit product.created:`, error);
    }
  }

  /**
   * Emit product.updated event to AI queue.
   */
  public async emitProductUpdated(product: ProductModel, categoryName?: string): Promise<void> {
    const payload = this.buildPayload(product, categoryName);
    try {
      this.client.emit('product.updated', payload);
      console.log(`[ProductEventProducer] Emitted product.updated: ${product.name} (${product.id})`);
    } catch (error) {
      console.error(`[ProductEventProducer] Failed to emit product.updated:`, error);
    }
  }

  /**
   * Emit product.deleted event to AI queue.
   */
  public async emitProductDeleted(productId: string, productName: string): Promise<void> {
    try {
      this.client.emit('product.deleted', { id: productId, name: productName });
      console.log(`[ProductEventProducer] Emitted product.deleted: ${productName} (${productId})`);
    } catch (error) {
      console.error(`[ProductEventProducer] Failed to emit product.deleted:`, error);
    }
  }

  private buildPayload(product: ProductModel, categoryName?: string): ProductEventPayload {
    return {
      id: product.id,
      category_id: product.categoryId,
      name: product.name,
      slug: product.slug,
      description: product.description,
      short_description: product.shortDescription,
      base_price: product.basePrice,
      thumbnail_url: product.thumbnailUrl,
      is_active: product.isActive,
      is_featured: product.isFeatured,
      preparation_time: product.preparationTime,
      calories: product.calories,
      tags: product.tags,
      sort_order: product.sortOrder,
      category_name: categoryName,
    };
  }
}
