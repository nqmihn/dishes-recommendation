import { Injectable } from '@nestjs/common';
import { ProductVariantRepository } from '../../repositories/product-variant-repository';
import { ProductVariantModel } from '../../models/product-variant-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';

@Injectable()
export class UpdateProductVariantUsecase {
  constructor(private readonly variantRepository: ProductVariantRepository) {}

  public async call(
    id: string,
    name: string | undefined,
    sku: string | undefined,
    price: number | undefined,
    originalPrice: number | undefined,
    stockQuantity: number | undefined,
    isDefault: boolean | undefined,
    isActive: boolean | undefined,
    sortOrder: number | undefined,
  ): Promise<ProductVariantModel> {
    const existing = await this.variantRepository.findById(id);
    if (!existing) {
      throw new LogicalException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND, 'Product variant not found.', undefined);
    }

    const updated = existing.copyWith({
      name: name ?? existing.name,
      sku: sku !== undefined ? sku : existing.sku,
      price: price ?? existing.price,
      originalPrice: originalPrice !== undefined ? originalPrice : existing.originalPrice,
      stockQuantity: stockQuantity ?? existing.stockQuantity,
      isDefault: isDefault ?? existing.isDefault,
      isActive: isActive ?? existing.isActive,
      sortOrder: sortOrder ?? existing.sortOrder,
      updatedAt: new Date(),
    });

    return await this.variantRepository.update(updated);
  }
}
