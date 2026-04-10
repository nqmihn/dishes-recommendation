import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category-repository';
import { CategoryDatasource } from '../datasources/category-datasource';
import { PageList } from 'src/core/models/page-list';
import { PageParams } from 'src/core/models/page-params';
import { SortParams } from 'src/core/models/sort-params';
import { CategoryModel } from '../../domain/models/category-model';
import { CategorySearchParams } from '../../domain/models/category-search-params';

@Injectable()
export class CategoryRepositoryImpl extends CategoryRepository {
  constructor(private readonly categoryDatasource: CategoryDatasource) {
    super();
  }

  public async create(category: CategoryModel): Promise<CategoryModel> {
    await this.categoryDatasource.add(category);
    return category;
  }

  public async createMany(categories: CategoryModel[]): Promise<CategoryModel[]> {
    await this.categoryDatasource.addMany(categories);
    return categories;
  }

  public async update(category: CategoryModel): Promise<CategoryModel> {
    await this.categoryDatasource.update(category);
    return category;
  }

  public async findById(id: string): Promise<CategoryModel | undefined> {
    return await this.categoryDatasource.findById(id);
  }

  public async findBySlug(slug: string): Promise<CategoryModel | undefined> {
    return await this.categoryDatasource.findBySlug(slug);
  }

  public async list(
    pageParams: PageParams,
    sortParams: SortParams,
    searchParams: CategorySearchParams,
  ): Promise<PageList<CategoryModel>> {
    return await this.categoryDatasource.list(pageParams, sortParams, searchParams);
  }

  public async delete(id: string): Promise<void> {
    await this.categoryDatasource.delete(id);
  }

  public async findTreeByParentId(parentId: string | undefined): Promise<CategoryModel[]> {
    return await this.categoryDatasource.findTreeByParentId(parentId);
  }
}
