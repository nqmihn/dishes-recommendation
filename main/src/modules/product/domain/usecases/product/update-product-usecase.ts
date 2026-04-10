import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { ProductModel } from '../../models/product-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import { CategoryRepository } from 'src/modules/category/domain/repositories/category-repository';
import { UpdateSearchDocumentsUsecase } from 'src/modules/search/domain/usecases/update-search-documents-usecase';

@Injectable()
export class UpdateProductUsecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly updateSearchDocumentsUsecase: UpdateSearchDocumentsUsecase,
  ) {}

  public async call(
    id: string,
    categoryId: string | undefined,
    name: string | undefined,
    slug: string | undefined,
    description: string | undefined,
    shortDescription: string | undefined,
    basePrice: number | undefined,
    thumbnailUrl: string | undefined,
    isActive: boolean | undefined,
    isFeatured: boolean | undefined,
    preparationTime: number | undefined,
    calories: number | undefined,
    tags: string[] | undefined,
    sortOrder: number | undefined,
  ): Promise<ProductModel> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new LogicalException(ErrorCode.PRODUCT_NOT_FOUND, 'Product not found.', undefined);
    }

    if (categoryId && categoryId !== existing.categoryId) {
      const category = await this.categoryRepository.findById(categoryId);
      if (!category) {
        throw new LogicalException(ErrorCode.CATEGORY_NOT_FOUND, 'Category not found.', undefined);
      }
    }

    if (slug && slug !== existing.slug) {
      const existingSlug = await this.productRepository.findBySlug(slug);
      if (existingSlug) {
        throw new LogicalException(ErrorCode.PRODUCT_SLUG_ALREADY_EXISTS, 'Product slug already exists.', undefined);
      }
    }

    const updated = existing.copyWith({
      categoryId: categoryId ?? existing.categoryId,
      name: name ?? existing.name,
      slug: slug ?? existing.slug,
      description: description !== undefined ? description : existing.description,
      shortDescription: shortDescription !== undefined ? shortDescription : existing.shortDescription,
      basePrice: basePrice ?? existing.basePrice,
      thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : existing.thumbnailUrl,
      isActive: isActive ?? existing.isActive,
      isFeatured: isFeatured ?? existing.isFeatured,
      preparationTime: preparationTime !== undefined ? preparationTime : existing.preparationTime,
      calories: calories !== undefined ? calories : existing.calories,
      tags: tags !== undefined ? tags : existing.tags,
      sortOrder: sortOrder ?? existing.sortOrder,
      updatedAt: new Date(),
    });

    return await this.productRepository.update(updated).then(async (result) => {
      await this.updateSearchDocumentsUsecase.call([result]);
      return result;
    });
  }
}
