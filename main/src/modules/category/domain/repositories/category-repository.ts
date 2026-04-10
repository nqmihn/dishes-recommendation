import { PageList } from 'src/core/models/page-list';
import { PageParams } from 'src/core/models/page-params';
import { SortParams } from 'src/core/models/sort-params';
import { CategoryModel } from '../models/category-model';
import { CategorySearchParams } from '../models/category-search-params';

export abstract class CategoryRepository {
  public abstract create(category: CategoryModel): Promise<CategoryModel>;

  public abstract createMany(categories: CategoryModel[]): Promise<CategoryModel[]>;

  public abstract update(category: CategoryModel): Promise<CategoryModel>;

  public abstract findById(id: string): Promise<CategoryModel | undefined>;

  public abstract findBySlug(slug: string): Promise<CategoryModel | undefined>;

  public abstract list(
    pageParams: PageParams,
    sortParams: SortParams,
    searchParams: CategorySearchParams,
  ): Promise<PageList<CategoryModel>>;

  public abstract delete(id: string): Promise<void>;

  public abstract findTreeByParentId(parentId: string | undefined): Promise<CategoryModel[]>;
}
