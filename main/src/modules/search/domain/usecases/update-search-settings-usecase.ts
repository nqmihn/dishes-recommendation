import { Injectable } from '@nestjs/common';
import { SearchRepository } from '../repositories/search-repository';
import { Settings } from 'meilisearch/src/types/types';

@Injectable()
export class UpdateSearchSettingsUsecase {
  constructor(private readonly searchRepository: SearchRepository) {}

  async call(index: string, setting: Settings): Promise<void> {
    await this.searchRepository.updateSettings(index, setting);
  }
}
