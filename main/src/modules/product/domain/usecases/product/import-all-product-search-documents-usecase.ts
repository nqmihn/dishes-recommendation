import { Injectable } from '@nestjs/common';
import { ListProductUsecase } from './list-product-usecase';
import { UpdateSearchDocumentsUsecase } from 'src/modules/search/domain/usecases/update-search-documents-usecase';
import { DeleteSearchIndexUsecase } from 'src/modules/search/domain/usecases/delete-search-index-usecase';
import { SortParams } from 'src/core/models/sort-params';
import { PageParams } from 'src/core/models/page-params';
import { ProductModel } from '../../models/product-model';
import { ProductSearchParams } from '../../models/product-search-params';

@Injectable()
export class ImportAllProductSearchDocumentsUseCase {
  constructor(
    private readonly listProductUsecase: ListProductUsecase,
    private readonly updateSearchDocuments: UpdateSearchDocumentsUsecase,
    private readonly deleteSearchIndexUsecase: DeleteSearchIndexUsecase,
  ) {}

  public async call(): Promise<void> {
    await this.deleteSearchIndexUsecase.call(ProductModel.searchIndexName);

    let page = 1;
    let products;
    do {
      products = await this.listProductUsecase.call(
        new PageParams(page, 100, false, false),
        new SortParams('id', 'asc'),
        new ProductSearchParams(undefined, undefined, undefined, undefined, undefined),
      );
      await this.updateSearchDocuments.call(products.data);
      page++;
    } while (products.data.length > 0);
  }
}
