import { ProductOptionModel } from '../models/product-option-model';

export abstract class ProductOptionRepository {
  public abstract create(option: ProductOptionModel): Promise<ProductOptionModel>;
  public abstract createMany(options: ProductOptionModel[]): Promise<ProductOptionModel[]>;
  public abstract update(option: ProductOptionModel): Promise<ProductOptionModel>;
  public abstract findById(id: string): Promise<ProductOptionModel | undefined>;
  public abstract delete(id: string): Promise<void>;
  public abstract findByGroupId(groupId: string): Promise<ProductOptionModel[]>;
}
