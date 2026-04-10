import { Injectable } from '@nestjs/common';
import { ProductVariantRepository } from '../../repositories/product-variant-repository';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';

@Injectable()
export class DeleteProductVariantUsecase {
  constructor(private readonly variantRepository: ProductVariantRepository) {}

  public async call(id: string): Promise<void> {
    const existing = await this.variantRepository.findById(id);
    if (!existing) {
      throw new LogicalException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND, 'Product variant not found.', undefined);
    }

    await this.variantRepository.delete(id);
  }
}
