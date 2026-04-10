import { Injectable } from '@nestjs/common';
import { ProductImageRepository } from '../../repositories/product-image-repository';

@Injectable()
export class DeleteProductImageUsecase {
  constructor(private readonly imageRepository: ProductImageRepository) {}

  public async call(id: string): Promise<void> {
    await this.imageRepository.delete(id);
  }
}
