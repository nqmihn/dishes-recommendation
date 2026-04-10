import { Injectable } from '@nestjs/common';
import { ProductOptionGroupRepository } from '../../repositories/product-option-group-repository';
import { ProductOptionGroupModel } from '../../models/product-option-group-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';

@Injectable()
export class UpdateProductOptionGroupUsecase {
  constructor(private readonly optionGroupRepository: ProductOptionGroupRepository) {}

  public async call(
    id: string,
    name: string | undefined,
    isRequired: boolean | undefined,
    minSelections: number | undefined,
    maxSelections: number | undefined,
    sortOrder: number | undefined,
  ): Promise<ProductOptionGroupModel> {
    const existing = await this.optionGroupRepository.findById(id);
    if (!existing) {
      throw new LogicalException(ErrorCode.PRODUCT_OPTION_GROUP_NOT_FOUND, 'Option group not found.', undefined);
    }

    const updated = existing.copyWith({
      name: name ?? existing.name,
      isRequired: isRequired ?? existing.isRequired,
      minSelections: minSelections ?? existing.minSelections,
      maxSelections: maxSelections ?? existing.maxSelections,
      sortOrder: sortOrder ?? existing.sortOrder,
      updatedAt: new Date(),
    });

    return await this.optionGroupRepository.update(updated);
  }
}
