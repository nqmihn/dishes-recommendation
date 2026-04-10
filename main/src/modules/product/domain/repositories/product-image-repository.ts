import { ProductImageModel } from '../models/product-image-model';

export abstract class ProductImageRepository {
  public abstract create(image: ProductImageModel): Promise<ProductImageModel>;
  public abstract createMany(images: ProductImageModel[]): Promise<ProductImageModel[]>;
  public abstract delete(id: string): Promise<void>;
  public abstract findByProductId(productId: string): Promise<ProductImageModel[]>;
}
