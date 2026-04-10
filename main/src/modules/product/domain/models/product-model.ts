import { SearchableModel } from 'src/modules/search/domain/models/searchable-model';

export class ProductModel extends SearchableModel {
  public static readonly searchIndexName = 'products';

  public readonly id!: string;
  public readonly categoryId!: string;
  public readonly name!: string;
  public readonly slug!: string;
  public readonly description!: string | undefined;
  public readonly shortDescription!: string | undefined;
  public readonly basePrice!: number;
  public readonly thumbnailUrl!: string | undefined;
  public readonly isActive!: boolean;
  public readonly isFeatured!: boolean;
  public readonly preparationTime!: number | undefined;
  public readonly calories!: number | undefined;
  public readonly tags!: string[] | undefined;
  public readonly sortOrder!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Relations (loaded on demand)
  public readonly variants!: ProductVariantModel[] | undefined;
  public readonly images!: ProductImageModel[] | undefined;
  public readonly optionGroups!: ProductOptionGroupModel[] | undefined;

  constructor(
    id: string,
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
    createdAt: Date,
    updatedAt: Date,
    variants?: ProductVariantModel[],
    images?: ProductImageModel[],
    optionGroups?: ProductOptionGroupModel[],
  ) {
    super();
    this.id = id;
    this.categoryId = categoryId;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.shortDescription = shortDescription;
    this.basePrice = basePrice;
    this.thumbnailUrl = thumbnailUrl;
    this.isActive = isActive;
    this.isFeatured = isFeatured;
    this.preparationTime = preparationTime;
    this.calories = calories;
    this.tags = tags;
    this.sortOrder = sortOrder;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.variants = variants;
    this.images = images;
    this.optionGroups = optionGroups;
  }

  public toJson(showHidden = false): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      category_id: this.categoryId,
      name: this.name,
      slug: this.slug,
      description: this.description,
      short_description: this.shortDescription,
      base_price: this.basePrice,
      thumbnail_url: this.thumbnailUrl,
      is_active: this.isActive,
      is_featured: this.isFeatured,
      preparation_time: this.preparationTime,
      calories: this.calories,
      tags: this.tags,
      sort_order: this.sortOrder,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };

    if (this.variants) {
      data.variants = this.variants.map((v) => v.toJson(showHidden));
    }

    if (this.images) {
      data.images = this.images.map((i) => i.toJson(showHidden));
    }

    if (this.optionGroups) {
      data.option_groups = this.optionGroups.map((g) => g.toJson(showHidden));
    }

    return this.filterHiddenIfNeed(data, showHidden);
  }

  public getSearchDocument({ isRelation = false }): Record<string, any> {
    const searchDocument: Record<string, any> = {
      name: this.name,
      slug: this.slug,
      description: this.description ?? '',
      short_description: this.shortDescription ?? '',
      tags: this.tags ?? [],
    };

    if (!isRelation) {
      searchDocument.id = this.id;
    }

    return searchDocument;
  }

  public getSearchIndexName(): string {
    return ProductModel.searchIndexName;
  }

  public static getSearchableKeys(): string[] {
    return ['name', 'slug', 'description', 'short_description', 'tags'];
  }

  protected getHidden(): string[] {
    return [];
  }
}

// --- Avoid circular: import after class definition is not needed, we use forward ref style ---
import { ProductVariantModel } from './product-variant-model';
import { ProductImageModel } from './product-image-model';
import { ProductOptionGroupModel } from './product-option-group-model';
