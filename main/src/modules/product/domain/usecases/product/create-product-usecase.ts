import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { ProductModel } from '../../models/product-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import { CategoryRepository } from 'src/modules/category/domain/repositories/category-repository';
import { UpdateSearchDocumentsUsecase } from 'src/modules/search/domain/usecases/update-search-documents-usecase';
import { ProductEventProducer } from '../../services/product-event-producer';
import crypto from 'crypto';

@Injectable()
export class CreateProductUsecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly updateSearchDocumentsUsecase: UpdateSearchDocumentsUsecase,
    private readonly productEventProducer: ProductEventProducer,
  ) {}

  public async call(
    categoryId: string,
    name: string,
    slug: string,
    description: string | undefined,
    shortDescription: string | undefined,
    basePrice: number,
    thumbnailUrl: string | undefined,
    isActive: boolean,
    isFeatured: boolean,
    preparationTime: number | undefined,
    calories: number | undefined,
    tags: string[] | undefined,
    sortOrder: number,
  ): Promise<ProductModel> {
    // Validate category exists
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new LogicalException(ErrorCode.CATEGORY_NOT_FOUND, 'Category not found.', undefined);
    }

    // Check slug uniqueness
    const existingSlug = await this.productRepository.findBySlug(slug);
    if (existingSlug) {
      throw new LogicalException(ErrorCode.PRODUCT_SLUG_ALREADY_EXISTS, 'Product slug already exists.', undefined);
    }

    const now = new Date();
    const product = new ProductModel(
      crypto.randomUUID(),
      categoryId,
      name,
      slug,
      description,
      shortDescription,
      basePrice,
      thumbnailUrl,
      isActive,
      isFeatured,
      preparationTime,
      calories,
      tags,
      sortOrder,
      now,
      now,
    );

    return await this.productRepository.create(product).then(async (created) => {
      await this.updateSearchDocumentsUsecase.call([created]);
      // Emit to AI queue for document generation
      await this.productEventProducer.emitProductCreated(created, category.name);
      return created;
    });
  }
}
