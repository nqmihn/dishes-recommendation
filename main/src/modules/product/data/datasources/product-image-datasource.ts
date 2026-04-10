import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImageEntity } from '../entities/product-image-entity';
import { ProductImageModel } from '../../domain/models/product-image-model';

@Injectable()
export class ProductImageDatasource {
  constructor(
    @InjectRepository(ProductImageEntity) private readonly imageRepo: Repository<ProductImageEntity>,
  ) {}

  public async addImage(image: ProductImageModel): Promise<void> {
    const entity = this.imageRepo.create({
      id: image.id,
      product_id: image.productId,
      image_url: image.imageUrl,
      alt_text: image.altText,
      sort_order: image.sortOrder,
      created_at: image.createdAt,
    });

    await this.imageRepo.insert(entity);
  }

  public async addManyImages(images: ProductImageModel[]): Promise<void> {
    if (images.length === 0) return;
    const entities = images.map((image) =>
      this.imageRepo.create({
        id: image.id,
        product_id: image.productId,
        image_url: image.imageUrl,
        alt_text: image.altText,
        sort_order: image.sortOrder,
        created_at: image.createdAt,
      }),
    );
    await this.imageRepo.insert(entities);
  }

  public async deleteImage(id: string): Promise<void> {
    await this.imageRepo.delete(id);
  }

  public async findImagesByProductId(productId: string): Promise<ProductImageModel[]> {
    const entities = await this.imageRepo.find({
      where: { product_id: productId },
      order: { sort_order: 'ASC' },
    });
    return entities.map((e) => e.toModel());
  }
}
