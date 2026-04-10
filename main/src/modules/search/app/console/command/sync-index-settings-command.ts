import { Command, Console } from 'nestjs-console';
import { UpdateSearchSettingsUsecase } from '../../../domain/usecases/update-search-settings-usecase';
import { ProductModel } from '../../../../product/domain/models/product-model';
@Console()
export class SyncIndexSettingsCommand {
  constructor(private readonly updateSearchSettingsUsecase: UpdateSearchSettingsUsecase) {}

  @Command({
    command: 'search:sync-index-settings',
  })
  async importAll(): Promise<void> {
    await this.updateSearchSettingsUsecase.call(ProductModel.searchIndexName, {
      searchableAttributes: ProductModel.getSearchableKeys(),
    });

    console.log('Sync index settings success.');
  }
}
