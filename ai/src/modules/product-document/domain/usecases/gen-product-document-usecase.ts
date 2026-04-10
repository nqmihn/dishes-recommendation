import { Injectable } from '@nestjs/common';
import { ProductDocumentModel } from '../models/product-document-model';
import { ProductDocumentRepository } from '../repositories/product-document-repository';
import { OpenAIService } from '../services/openai-service';
import {v7 as uuidv7} from 'uuid';

export interface ProductPayload {
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
export class GenProductDocumentUsecase {
  constructor(
    private readonly productDocumentRepository: ProductDocumentRepository,
    private readonly openAIService: OpenAIService,
  ) {}

  public async call(product: ProductPayload): Promise<ProductDocumentModel> {
    const prompt = this.buildPrompt(product);

    console.log(`[GenProductDocument] Generating document for product: ${product.name} (${product.id})`);
    const document = await this.openAIService.generateDocument(prompt);
    console.log(`[GenProductDocument] Document generated (${document.length} chars)`);
    console.log(`[GenProductDocument] Demo context: ${document.substring(0, 200)}...`);

    console.log(`[GenProductDocument] Generating embedding for product: ${product.name}`);
    const embedding = await this.openAIService.generateEmbedding(document);
    console.log(`[GenProductDocument] Embedding generated (${embedding.length} dimensions)`);

    const metadata: Record<string, any> = {
      category_id: product.category_id,
      category_name: product.category_name,
      slug: product.slug,
      base_price: product.base_price,
      is_active: product.is_active,
      is_featured: product.is_featured,
      tags: product.tags,
      calories: product.calories,
      preparation_time: product.preparation_time,
    };

    const now = new Date();
    const existing = await this.productDocumentRepository.findByProductId(product.id);

    const model = new ProductDocumentModel(
      existing?.id ?? uuidv7(),
      product.id,
      product.name,
      document,
      embedding,
      metadata,
      existing?.createdAt ?? now,
      now,
    );

    return await this.productDocumentRepository.upsertByProductId(model);
  }

  private buildPrompt(product: ProductPayload): string {
    const parts: string[] = [];

    parts.push(`Tên sản phẩm: ${product.name}`);

    if (product.category_name) {
      parts.push(`Danh mục: ${product.category_name}`);
    }

    if (product.description) {
      parts.push(`Mô tả: ${product.description}`);
    }

    if (product.short_description) {
      parts.push(`Mô tả ngắn: ${product.short_description}`);
    }

    parts.push(`Giá: ${product.base_price.toLocaleString('vi-VN')} VND`);

    if (product.preparation_time) {
      parts.push(`Thời gian chuẩn bị: ${product.preparation_time} phút`);
    }

    if (product.calories) {
      parts.push(`Calo: ${product.calories} kcal`);
    }

    if (product.tags && product.tags.length > 0) {
      parts.push(`Tags: ${product.tags.join(', ')}`);
    }

    if (product.is_featured) {
      parts.push(`Đây là sản phẩm nổi bật/được đề xuất.`);
    }

    return parts.join('\n');
  }
}
