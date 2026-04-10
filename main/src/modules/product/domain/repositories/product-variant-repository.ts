import { ProductVariantModel } from '../models/product-variant-model';

export abstract class ProductVariantRepository {
  public abstract create(variant: ProductVariantModel): Promise<ProductVariantModel>;
  public abstract createMany(variants: ProductVariantModel[]): Promise<ProductVariantModel[]>;
  public abstract update(variant: ProductVariantModel): Promise<ProductVariantModel>;
  public abstract findById(id: string): Promise<ProductVariantModel | undefined>;
  public abstract delete(id: string): Promise<void>;
  public abstract findByProductId(productId: string): Promise<ProductVariantModel[]>;
}
