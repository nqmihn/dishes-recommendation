import { Injectable } from '@nestjs/common';
import { ProductVariantRepository } from '../../repositories/product-variant-repository';
import { ProductRepository } from '../../repositories/product-repository';
import { ProductVariantModel } from '../../models/product-variant-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import crypto from 'crypto';

@Injectable()
export class CreateProductVariantUsecase {
  constructor(
    private readonly variantRepository: ProductVariantRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  public async call(
    productId: string,
    name: string,
    sku: string | undefined,
    price: number,
    originalPrice: number | undefined,
    stockQuantity: number,
    isDefault: boolean,
    isActive: boolean,
    sortOrder: number,
  ): Promise<ProductVariantModel> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new LogicalException(ErrorCode.PRODUCT_NOT_FOUND, 'Product not found.', undefined);
    }

    const now = new Date();
    const variant = new ProductVariantModel(
      crypto.randomUUID(),
      productId,
      name,
      sku,
      price,
      originalPrice,
      stockQuantity,
      isDefault,
      isActive,
      sortOrder,
      now,
      now,
    );

    return await this.variantRepository.create(variant);
  }
}
