import { ProductOptionGroupModel } from '../models/product-option-group-model';

export abstract class ProductOptionGroupRepository {
  public abstract create(group: ProductOptionGroupModel): Promise<ProductOptionGroupModel>;
  public abstract createMany(groups: ProductOptionGroupModel[]): Promise<ProductOptionGroupModel[]>;
  public abstract update(group: ProductOptionGroupModel): Promise<ProductOptionGroupModel>;
  public abstract findById(id: string): Promise<ProductOptionGroupModel | undefined>;
  public abstract delete(id: string): Promise<void>;
  public abstract findByProductId(productId: string): Promise<ProductOptionGroupModel[]>;
}
