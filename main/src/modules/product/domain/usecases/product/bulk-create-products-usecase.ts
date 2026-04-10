import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { ProductVariantRepository } from '../../repositories/product-variant-repository';
import { ProductImageRepository } from '../../repositories/product-image-repository';
import { ProductOptionGroupRepository } from '../../repositories/product-option-group-repository';
import { ProductOptionRepository } from '../../repositories/product-option-repository';
import { ProductModel } from '../../models/product-model';
import { ProductVariantModel } from '../../models/product-variant-model';
import { ProductImageModel } from '../../models/product-image-model';
import { ProductOptionGroupModel } from '../../models/product-option-group-model';
import { ProductOptionModel } from '../../models/product-option-model';
import { CategoryRepository } from 'src/modules/category/domain/repositories/category-repository';
import { UpdateSearchDocumentsUsecase } from 'src/modules/search/domain/usecases/update-search-documents-usecase';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import crypto from 'crypto';

export interface CreateProductOptionInput {
  name: string;
  additionalPrice: number;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface CreateProductOptionGroupInput {
  name: string;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  sortOrder: number;
  options: CreateProductOptionInput[];
}

export interface CreateProductVariantInput {
  name: string;
  sku: string | undefined;
  price: number;
  originalPrice: number | undefined;
  stockQuantity: number;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface CreateProductImageInput {
  imageUrl: string;
  altText: string | undefined;
  sortOrder: number;
}

export interface CreateProductInput {
  categoryId: string;
  name: string;
  slug: string;
  description: string | undefined;
  shortDescription: string | undefined;
  basePrice: number;
  thumbnailUrl: string | undefined;
  isActive: boolean;
  isFeatured: boolean;
  preparationTime: number | undefined;
  calories: number | undefined;
  tags: string[] | undefined;
  sortOrder: number;
  variants: CreateProductVariantInput[];
  images: CreateProductImageInput[];
  optionGroups: CreateProductOptionGroupInput[];
}

export interface CreatedProductResult {
  product: ProductModel;
  variants: ProductVariantModel[];
  images: ProductImageModel[];
  optionGroups: ProductOptionGroupModel[];
  options: ProductOptionModel[];
}

@Injectable()
export class BulkCreateProductsUsecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly variantRepository: ProductVariantRepository,
    private readonly imageRepository: ProductImageRepository,
    private readonly optionGroupRepository: ProductOptionGroupRepository,
    private readonly optionRepository: ProductOptionRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly updateSearchDocumentsUsecase: UpdateSearchDocumentsUsecase,
  ) {}

  public async call(inputs: CreateProductInput[]): Promise<CreatedProductResult[]> {
    if (inputs.length === 0) return [];

    // ── Validate slugs unique within input ──────────────────────────────
    const slugs = inputs.map((i) => i.slug);
    if (new Set(slugs).size !== slugs.length) {
      throw new LogicalException(
        ErrorCode.PRODUCT_SLUG_ALREADY_EXISTS,
        'Duplicate slugs found in input list.',
        undefined,
      );
    }

    // ── Validate slugs unique in DB (parallel) ──────────────────────────
    const slugChecks = await Promise.all(inputs.map((i) => this.productRepository.findBySlug(i.slug)));
    const duplicateSlug = inputs.find((_, idx) => slugChecks[idx] !== undefined);
    if (duplicateSlug) {
      throw new LogicalException(
        ErrorCode.PRODUCT_SLUG_ALREADY_EXISTS,
        `Product slug already exists: ${duplicateSlug.slug}`,
        undefined,
      );
    }

    // ── Validate all categoryIds exist (parallel, deduplicated) ─────────
    const categoryIds = [...new Set(inputs.map((i) => i.categoryId))];
    const categoryChecks = await Promise.all(categoryIds.map((id) => this.categoryRepository.findById(id)));
    const missingCategory = categoryIds.find((id, idx) => categoryChecks[idx] === undefined);
    if (missingCategory) {
      throw new LogicalException(
        ErrorCode.CATEGORY_NOT_FOUND,
        `Category not found: ${missingCategory}`,
        undefined,
      );
    }

    const now = new Date();

    // ── Build all models ─────────────────────────────────────────────────
    const allProducts: ProductModel[] = [];
    const allVariants: ProductVariantModel[] = [];
    const allImages: ProductImageModel[] = [];
    const allOptionGroups: ProductOptionGroupModel[] = [];
    const allOptions: ProductOptionModel[] = [];

    // Track per-product results for return value
    const resultMap: CreatedProductResult[] = inputs.map((input) => {
      const productId = crypto.randomUUID();

      const product = new ProductModel(
        productId,
        input.categoryId,
        input.name,
        input.slug,
        input.description,
        input.shortDescription,
        input.basePrice,
        input.thumbnailUrl,
        input.isActive,
        input.isFeatured,
        input.preparationTime,
        input.calories,
        input.tags,
        input.sortOrder,
        now,
        now,
      );
      allProducts.push(product);

      const variants = input.variants.map(
        (v) =>
          new ProductVariantModel(
            crypto.randomUUID(),
            productId,
            v.name,
            v.sku,
            v.price,
            v.originalPrice,
            v.stockQuantity,
            v.isDefault,
            v.isActive,
            v.sortOrder,
            now,
            now,
          ),
      );
      allVariants.push(...variants);

      const images = input.images.map(
        (img) => new ProductImageModel(crypto.randomUUID(), productId, img.imageUrl, img.altText, img.sortOrder, now),
      );
      allImages.push(...images);

      const optionGroups: ProductOptionGroupModel[] = [];
      const options: ProductOptionModel[] = [];

      for (const groupInput of input.optionGroups) {
        const groupId = crypto.randomUUID();
        const group = new ProductOptionGroupModel(
          groupId,
          productId,
          groupInput.name,
          groupInput.isRequired,
          groupInput.minSelections,
          groupInput.maxSelections,
          groupInput.sortOrder,
          now,
          now,
        );
        optionGroups.push(group);
        allOptionGroups.push(group);

        const groupOptions = groupInput.options.map(
          (opt) =>
            new ProductOptionModel(
              crypto.randomUUID(),
              groupId,
              opt.name,
              opt.additionalPrice,
              opt.isDefault,
              opt.isActive,
              opt.sortOrder,
              now,
              now,
            ),
        );
        options.push(...groupOptions);
        allOptions.push(...groupOptions);
      }

      return { product, variants, images, optionGroups, options };
    });

    // ── Bulk insert in correct order (respect FK constraints) ────────────
    await this.productRepository.createMany(allProducts);
    await Promise.all([
      this.variantRepository.createMany(allVariants),
      this.imageRepository.createMany(allImages),
    ]);
    await this.optionGroupRepository.createMany(allOptionGroups);
    await this.optionRepository.createMany(allOptions);

    // ── Index all created products in search engine in one call ──────────
    await this.updateSearchDocumentsUsecase.call(allProducts);

    return resultMap;
  }
}
