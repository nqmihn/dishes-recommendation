import { Injectable } from '@nestjs/common';
import { ProductImageRepository } from '../../domain/repositories/product-image-repository';
import { ProductImageDatasource } from '../datasources/product-image-datasource';
import { ProductImageModel } from '../../domain/models/product-image-model';

@Injectable()
export class ProductImageRepositoryImpl extends ProductImageRepository {
  constructor(private readonly imageDatasource: ProductImageDatasource) {
    super();
  }

  public async create(image: ProductImageModel): Promise<ProductImageModel> {
    await this.imageDatasource.addImage(image);
    return image;
  }

  public async createMany(images: ProductImageModel[]): Promise<ProductImageModel[]> {
    await this.imageDatasource.addManyImages(images);
    return images;
  }

  public async delete(id: string): Promise<void> {
    await this.imageDatasource.deleteImage(id);
  }

  public async findByProductId(productId: string): Promise<ProductImageModel[]> {
    return await this.imageDatasource.findImagesByProductId(productId);
  }
}
