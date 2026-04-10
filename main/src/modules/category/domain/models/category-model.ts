import { DomainModel } from 'src/core/models/domain-model';

export class CategoryModel extends DomainModel {
  public readonly id!: string;
  public readonly name!: string;
  public readonly slug!: string;
  public readonly description!: string | undefined;
  public readonly imageUrl!: string | undefined;
  public readonly parentId!: string | undefined;
  public readonly sortOrder!: number;
  public readonly isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Nested children (loaded on demand)
  public readonly children!: CategoryModel[] | undefined;

  constructor(
    id: string,
    name: string,
    slug: string,
    description: string | undefined,
    imageUrl: string | undefined,
    parentId: string | undefined,
    sortOrder: number,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    children?: CategoryModel[],
  ) {
    super();
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.imageUrl = imageUrl;
    this.parentId = parentId;
    this.sortOrder = sortOrder;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.children = children;
  }

  public toJson(showHidden = false): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      image_url: this.imageUrl,
      parent_id: this.parentId,
      sort_order: this.sortOrder,
      is_active: this.isActive,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };

    if (this.children) {
      data.children = this.children.map((c) => c.toJson(showHidden));
    }

    return this.filterHiddenIfNeed(data, showHidden);
  }
}
