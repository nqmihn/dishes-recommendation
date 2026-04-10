import { Injectable } from '@nestjs/common';
import { SearchRepository } from '../repositories/search-repository';
import { SearchableModel } from '../models/searchable-model';

@Injectable()
export class UpdateSearchDocumentsUsecase {
  constructor(private readonly searchRepository: SearchRepository) {}

  async call(searchable: SearchableModel[]): Promise<void> {
    if (searchable.length == 0) {
      return;
    }

    await this.searchRepository.updateDocuments(searchable);
  }
}
