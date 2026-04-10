import { Injectable } from '@nestjs/common';
import { ProductOptionRepository } from '../../repositories/product-option-repository';
import { ProductOptionModel } from '../../models/product-option-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';

@Injectable()
export class UpdateProductOptionUsecase {
  constructor(private readonly optionRepository: ProductOptionRepository) {}

  public async call(
    id: string,
    name: string | undefined,
    additionalPrice: number | undefined,
    isDefault: boolean | undefined,
    isActive: boolean | undefined,
    sortOrder: number | undefined,
  ): Promise<ProductOptionModel> {
    const existing = await this.optionRepository.findById(id);
    if (!existing) {
      throw new LogicalException(ErrorCode.PRODUCT_OPTION_NOT_FOUND, 'Option not found.', undefined);
    }

    const updated = existing.copyWith({
      name: name ?? existing.name,
      additionalPrice: additionalPrice ?? existing.additionalPrice,
      isDefault: isDefault ?? existing.isDefault,
      isActive: isActive ?? existing.isActive,
      sortOrder: sortOrder ?? existing.sortOrder,
      updatedAt: new Date(),
    });

    return await this.optionRepository.update(updated);
  }
}
