import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category-repository';
import { CategoryModel } from '../models/category-model';

@Injectable()
export class GetCategoryTreeUsecase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async call(): Promise<CategoryModel[]> {
    return await this.categoryRepository.findTreeByParentId(undefined);
  }
}
