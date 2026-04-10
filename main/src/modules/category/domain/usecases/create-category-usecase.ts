import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category-repository';
import { CategoryModel } from '../models/category-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import crypto from 'crypto';

@Injectable()
export class CreateCategoryUsecase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async call(
    name: string,
    slug: string,
    description: string | undefined,
    imageUrl: string | undefined,
    parentId: string | undefined,
    sortOrder: number,
    isActive: boolean,
  ): Promise<CategoryModel> {
    const existingSlug = await this.categoryRepository.findBySlug(slug);
    if (existingSlug) {
      throw new LogicalException(ErrorCode.CATEGORY_SLUG_ALREADY_EXISTS, 'Category slug already exists.', undefined);
    }

    if (parentId) {
      const parent = await this.categoryRepository.findById(parentId);
      if (!parent) {
        throw new LogicalException(ErrorCode.CATEGORY_NOT_FOUND, 'Parent category not found.', undefined);
      }
    }

    const now = new Date();
    const category = new CategoryModel(
      crypto.randomUUID(),
      name,
      slug,
      description,
      imageUrl,
      parentId,
      sortOrder,
      isActive,
      now,
      now,
    );

    return await this.categoryRepository.create(category);
  }
}
