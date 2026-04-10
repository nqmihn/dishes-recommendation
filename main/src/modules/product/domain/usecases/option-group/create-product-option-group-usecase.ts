import { Injectable } from '@nestjs/common';
import { ProductOptionGroupRepository } from '../../repositories/product-option-group-repository';
import { ProductRepository } from '../../repositories/product-repository';
import { ProductOptionGroupModel } from '../../models/product-option-group-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import crypto from 'crypto';

@Injectable()
export class CreateProductOptionGroupUsecase {
  constructor(
    private readonly optionGroupRepository: ProductOptionGroupRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  public async call(
    productId: string,
    name: string,
    isRequired: boolean,
    minSelections: number,
    maxSelections: number,
    sortOrder: number,
  ): Promise<ProductOptionGroupModel> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new LogicalException(ErrorCode.PRODUCT_NOT_FOUND, 'Product not found.', undefined);
    }

    const now = new Date();
    const group = new ProductOptionGroupModel(
      crypto.randomUUID(),
      productId,
      name,
      isRequired,
      minSelections,
      maxSelections,
      sortOrder,
      now,
      now,
    );

    return await this.optionGroupRepository.create(group);
  }
}
