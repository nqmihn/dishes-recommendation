import { Injectable } from '@nestjs/common';
import { SearchRepository } from '../repositories/search-repository';

@Injectable()
export class DeleteSearchIndexUsecase {
  constructor(private readonly searchRepository: SearchRepository) {}

  async call(index: string): Promise<void> {
    await this.searchRepository.delete(index);
  }
}
