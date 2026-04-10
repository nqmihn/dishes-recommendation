import { DomainModel } from 'src/core/models/domain-model';

export class ProductVariantModel extends DomainModel {
  public readonly id!: string;
  public readonly productId!: string;
  public readonly name!: string;
  public readonly sku!: string | undefined;
  public readonly price!: number;
  public readonly originalPrice!: number | undefined;
  public readonly stockQuantity!: number;
  public readonly isDefault!: boolean;
  public readonly isActive!: boolean;
  public readonly sortOrder!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  constructor(
    id: string,
    productId: string,
    name: string,
    sku: string | undefined,
    price: number,
    originalPrice: number | undefined,
    stockQuantity: number,
    isDefault: boolean,
    isActive: boolean,
    sortOrder: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.id = id;
    this.productId = productId;
    this.name = name;
    this.sku = sku;
    this.price = price;
    this.originalPrice = originalPrice;
    this.stockQuantity = stockQuantity;
    this.isDefault = isDefault;
    this.isActive = isActive;
    this.sortOrder = sortOrder;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public toJson(showHidden = false): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      product_id: this.productId,
      name: this.name,
      sku: this.sku,
      price: this.price,
      original_price: this.originalPrice,
      stock_quantity: this.stockQuantity,
      is_default: this.isDefault,
      is_active: this.isActive,
      sort_order: this.sortOrder,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };

    return this.filterHiddenIfNeed(data, showHidden);
  }
}
