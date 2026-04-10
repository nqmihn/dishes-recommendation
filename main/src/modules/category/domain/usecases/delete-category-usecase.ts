import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category-repository';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';

@Injectable()
export class DeleteCategoryUsecase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async call(id: string): Promise<void> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new LogicalException(ErrorCode.CATEGORY_NOT_FOUND, 'Category not found.', undefined);
    }

    // Check if category has children
    const children = await this.categoryRepository.findTreeByParentId(id);
    if (children.length > 0) {
      throw new LogicalException(
        ErrorCode.CATEGORY_HAS_CHILDREN,
        'Cannot delete category with sub-categories.',
        undefined,
      );
    }

    await this.categoryRepository.delete(id);
  }
}
