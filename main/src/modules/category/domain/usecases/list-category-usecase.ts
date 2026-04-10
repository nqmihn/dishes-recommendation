import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category-repository';
import { PageList } from 'src/core/models/page-list';
import { PageParams } from 'src/core/models/page-params';
import { SortParams } from 'src/core/models/sort-params';
import { CategoryModel } from '../models/category-model';
import { CategorySearchParams } from '../models/category-search-params';

@Injectable()
export class ListCategoryUsecase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async call(
    pageParams: PageParams,
    sortParams: SortParams,
    searchParams: CategorySearchParams,
  ): Promise<PageList<CategoryModel>> {
    return await this.categoryRepository.list(pageParams, sortParams, searchParams);
  }
}
