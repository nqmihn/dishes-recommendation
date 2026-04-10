import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { PageList } from 'src/core/models/page-list';
import { PageParams } from 'src/core/models/page-params';
import { SortParams } from 'src/core/models/sort-params';
import { ProductModel } from '../../models/product-model';
import { ProductSearchParams } from '../../models/product-search-params';

@Injectable()
export class ListProductUsecase {
  constructor(private readonly productRepository: ProductRepository) {}

  public async call(
    pageParams: PageParams,
    sortParams: SortParams,
    searchParams: ProductSearchParams,
  ): Promise<PageList<ProductModel>> {
    return await this.productRepository.list(pageParams, sortParams, searchParams);
  }
}
