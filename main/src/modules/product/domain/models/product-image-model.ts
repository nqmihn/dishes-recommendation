import { DomainModel } from 'src/core/models/domain-model';

export class ProductImageModel extends DomainModel {
  public readonly id!: string;
  public readonly productId!: string;
  public readonly imageUrl!: string;
  public readonly altText!: string | undefined;
  public readonly sortOrder!: number;
  public readonly createdAt!: Date;

  constructor(
    id: string,
    productId: string,
    imageUrl: string,
    altText: string | undefined,
    sortOrder: number,
    createdAt: Date,
  ) {
    super();
    this.id = id;
    this.productId = productId;
    this.imageUrl = imageUrl;
    this.altText = altText;
    this.sortOrder = sortOrder;
    this.createdAt = createdAt;
  }

  public toJson(showHidden = false): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      product_id: this.productId,
      image_url: this.imageUrl,
      alt_text: this.altText,
      sort_order: this.sortOrder,
      created_at: this.createdAt,
    };

    return this.filterHiddenIfNeed(data, showHidden);
  }
}
