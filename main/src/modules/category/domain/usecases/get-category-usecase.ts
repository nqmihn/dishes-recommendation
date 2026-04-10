import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category-repository';
import { CategoryModel } from '../models/category-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';

@Injectable()
export class GetCategoryUsecase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async call(id: string): Promise<CategoryModel> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new LogicalException(ErrorCode.CATEGORY_NOT_FOUND, 'Category not found.', undefined);
    }
    return category;
  }
}
