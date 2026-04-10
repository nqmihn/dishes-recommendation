import { Injectable } from '@nestjs/common';
import { ProductOptionGroupRepository } from '../../repositories/product-option-group-repository';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';

@Injectable()
export class DeleteProductOptionGroupUsecase {
  constructor(private readonly optionGroupRepository: ProductOptionGroupRepository) {}

  public async call(id: string): Promise<void> {
    const existing = await this.optionGroupRepository.findById(id);
    if (!existing) {
      throw new LogicalException(ErrorCode.PRODUCT_OPTION_GROUP_NOT_FOUND, 'Option group not found.', undefined);
    }

    await this.optionGroupRepository.delete(id);
  }
}
