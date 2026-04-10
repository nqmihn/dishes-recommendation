import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category-repository';
import { CategoryModel } from '../models/category-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';

@Injectable()
export class UpdateCategoryUsecase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async call(
    id: string,
    name: string | undefined,
    slug: string | undefined,
    description: string | undefined,
    imageUrl: string | undefined,
    parentId: string | undefined,
    sortOrder: number | undefined,
    isActive: boolean | undefined,
  ): Promise<CategoryModel> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new LogicalException(ErrorCode.CATEGORY_NOT_FOUND, 'Category not found.', undefined);
    }

    if (slug && slug !== existing.slug) {
      const existingSlug = await this.categoryRepository.findBySlug(slug);
      if (existingSlug) {
        throw new LogicalException(ErrorCode.CATEGORY_SLUG_ALREADY_EXISTS, 'Category slug already exists.', undefined);
      }
    }

    if (parentId && parentId !== existing.parentId) {
      if (parentId === id) {
        throw new LogicalException(ErrorCode.INVALID_REQUEST, 'Category cannot be its own parent.', undefined);
      }
      const parent = await this.categoryRepository.findById(parentId);
      if (!parent) {
        throw new LogicalException(ErrorCode.CATEGORY_NOT_FOUND, 'Parent category not found.', undefined);
      }
    }

    const updated = existing.copyWith({
      name: name ?? existing.name,
      slug: slug ?? existing.slug,
      description: description !== undefined ? description : existing.description,
      imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
      parentId: parentId !== undefined ? parentId : existing.parentId,
      sortOrder: sortOrder ?? existing.sortOrder,
      isActive: isActive ?? existing.isActive,
      updatedAt: new Date(),
    });

    return await this.categoryRepository.update(updated);
  }
}
