import { Command, Console } from 'nestjs-console';
import { ImportAllProductSearchDocumentsUseCase } from 'src/modules/product/domain/usecases/product/import-all-product-search-documents-usecase';

@Console()
export class IndexAllSearchableCommand {
  constructor(
    private readonly importAllProductSearchDocumentsUsecase: ImportAllProductSearchDocumentsUseCase,
  ) {}

  @Command({
    command: 'search:index:all',
  })
  async importAll(): Promise<void> {
    await this.importAllProductSearchDocumentsUsecase.call();
    console.log('Import products success!');
  }
}
