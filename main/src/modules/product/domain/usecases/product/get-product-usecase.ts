import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { ProductModel } from '../../models/product-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';

@Injectable()
export class GetProductUsecase {
  constructor(private readonly productRepository: ProductRepository) {}

  public async call(id: string): Promise<ProductModel> {
    const product = await this.productRepository.findByIdWithRelations(id);
    if (!product) {
      throw new LogicalException(ErrorCode.PRODUCT_NOT_FOUND, 'Product not found.', undefined);
    }
    return product;
  }
}
