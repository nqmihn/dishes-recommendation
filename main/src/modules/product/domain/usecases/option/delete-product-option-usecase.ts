import { Injectable } from '@nestjs/common';
import { ProductOptionRepository } from '../../repositories/product-option-repository';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';

@Injectable()
export class DeleteProductOptionUsecase {
  constructor(private readonly optionRepository: ProductOptionRepository) {}

  public async call(id: string): Promise<void> {
    const existing = await this.optionRepository.findById(id);
    if (!existing) {
      throw new LogicalException(ErrorCode.PRODUCT_OPTION_NOT_FOUND, 'Option not found.', undefined);
    }

    await this.optionRepository.delete(id);
  }
}
