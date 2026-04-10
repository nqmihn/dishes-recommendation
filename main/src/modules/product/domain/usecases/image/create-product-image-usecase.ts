import { Injectable } from '@nestjs/common';
import { ProductImageRepository } from '../../repositories/product-image-repository';
import { ProductRepository } from '../../repositories/product-repository';
import { ProductImageModel } from '../../models/product-image-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import crypto from 'crypto';

@Injectable()
export class CreateProductImageUsecase {
  constructor(
    private readonly imageRepository: ProductImageRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  public async call(
    productId: string,
    imageUrl: string,
    altText: string | undefined,
    sortOrder: number,
  ): Promise<ProductImageModel> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new LogicalException(ErrorCode.PRODUCT_NOT_FOUND, 'Product not found.', undefined);
    }

    const image = new ProductImageModel(
      crypto.randomUUID(),
      productId,
      imageUrl,
      altText,
      sortOrder,
      new Date(),
    );

    return await this.imageRepository.create(image);
  }
}
