import { Injectable } from '@nestjs/common';
import { ProductOptionRepository } from '../../repositories/product-option-repository';
import { ProductOptionGroupRepository } from '../../repositories/product-option-group-repository';
import { ProductOptionModel } from '../../models/product-option-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import crypto from 'crypto';

@Injectable()
export class CreateProductOptionUsecase {
  constructor(
    private readonly optionRepository: ProductOptionRepository,
    private readonly optionGroupRepository: ProductOptionGroupRepository,
  ) {}

  public async call(
    optionGroupId: string,
    name: string,
    additionalPrice: number,
    isDefault: boolean,
    isActive: boolean,
    sortOrder: number,
  ): Promise<ProductOptionModel> {
    const group = await this.optionGroupRepository.findById(optionGroupId);
    if (!group) {
      throw new LogicalException(ErrorCode.PRODUCT_OPTION_GROUP_NOT_FOUND, 'Option group not found.', undefined);
    }

    const now = new Date();
    const option = new ProductOptionModel(
      crypto.randomUUID(),
      optionGroupId,
      name,
      additionalPrice,
      isDefault,
      isActive,
      sortOrder,
      now,
      now,
    );

    return await this.optionRepository.create(option);
  }
}
