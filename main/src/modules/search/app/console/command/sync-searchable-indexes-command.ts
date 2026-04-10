import { Command, Console } from 'nestjs-console';
import { SyncSearchIndexesUsecase } from 'src/modules/search/domain/usecases/sync-search-indexes-usecase';

@Console()
export class SyncSearchableIndexesCommand {
  constructor(private readonly syncSearchIndexesUsecase: SyncSearchIndexesUsecase) {}

  @Command({
    command: 'search:indexes:sync',
  })
  async sync() {
    await this.syncSearchIndexesUsecase.call();
    console.log('Sync search indexes success!');
  }
}
