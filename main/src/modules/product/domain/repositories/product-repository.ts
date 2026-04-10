import { PageList } from 'src/core/models/page-list';
import { PageParams } from 'src/core/models/page-params';
import { SortParams } from 'src/core/models/sort-params';
import { ProductModel } from '../models/product-model';
import { ProductSearchParams } from '../models/product-search-params';

export abstract class ProductRepository {
  public abstract create(product: ProductModel): Promise<ProductModel>;
  public abstract createMany(products: ProductModel[]): Promise<ProductModel[]>;
  public abstract update(product: ProductModel): Promise<ProductModel>;
  public abstract findById(id: string): Promise<ProductModel | undefined>;
  public abstract findManyByIds(ids: string[]): Promise<ProductModel[]>;
  public abstract findByIdWithRelations(id: string): Promise<ProductModel | undefined>;
  public abstract findBySlug(slug: string): Promise<ProductModel | undefined>;
  public abstract list(
    pageParams: PageParams,
    sortParams: SortParams,
    searchParams: ProductSearchParams,
  ): Promise<PageList<ProductModel>>;
  public abstract delete(id: string): Promise<void>;
}
