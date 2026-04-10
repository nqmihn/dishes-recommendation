import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category-repository';
import { CategoryModel } from '../models/category-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import {v7 as uuidv7} from 'uuid';
export interface CreateCategoryInput {
  name: string;
  slug: string;
  description: string | undefined;
  imageUrl: string | undefined;
  parentId: string | undefined;
  sortOrder: number;
  isActive: boolean;
}

@Injectable()
export class BulkCreateCategoriesUsecase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async call(inputs: CreateCategoryInput[]): Promise<CategoryModel[]> {
    if (inputs.length === 0) return [];

    // Check slug uniqueness within input list
    const slugs = inputs.map((i) => i.slug);
    const uniqueSlugs = new Set(slugs);
    if (uniqueSlugs.size !== slugs.length) {
      throw new LogicalException(
        ErrorCode.CATEGORY_SLUG_ALREADY_EXISTS,
        'Duplicate slugs found in input list.',
        undefined,
      );
    }

    // Check slug uniqueness in DB (parallel)
    const existingChecks = await Promise.all(
      inputs.map((i) => this.categoryRepository.findBySlug(i.slug)),
    );
    const duplicateSlug = inputs.find((_, idx) => existingChecks[idx] !== undefined);
    if (duplicateSlug) {
      throw new LogicalException(
        ErrorCode.CATEGORY_SLUG_ALREADY_EXISTS,
        `Category slug already exists: ${duplicateSlug.slug}`,
        undefined,
      );
    }

    // Validate parentIds exist (collect unique non-null parentIds)
    const parentIds = [...new Set(inputs.map((i) => i.parentId).filter((id): id is string => !!id))];
    if (parentIds.length > 0) {
      const parentChecks = await Promise.all(
        parentIds.map((id) => this.categoryRepository.findById(id)),
      );
      const missingParent = parentIds.find((id, idx) => parentChecks[idx] === undefined);
      if (missingParent) {
        throw new LogicalException(
          ErrorCode.CATEGORY_NOT_FOUND,
          `Parent category not found: ${missingParent}`,
          undefined,
        );
      }
    }

    const now = new Date();
    const categories = inputs.map(
      (input) =>
        new CategoryModel(
          uuidv7(),
          input.name,
          input.slug,
          input.description,
          input.imageUrl,
          input.parentId,
          input.sortOrder,
          input.isActive,
          now,
          now,
        ),
    );

    return await this.categoryRepository.createMany(categories);
  }
}
