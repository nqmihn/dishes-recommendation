import { DomainModel } from 'src/core/models/domain-model';
import { ProductOptionModel } from './product-option-model';

export class ProductOptionGroupModel extends DomainModel {
  public readonly id!: string;
  public readonly productId!: string;
  public readonly name!: string;
  public readonly isRequired!: boolean;
  public readonly minSelections!: number;
  public readonly maxSelections!: number;
  public readonly sortOrder!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Nested options
  public readonly options!: ProductOptionModel[] | undefined;

  constructor(
    id: string,
    productId: string,
    name: string,
    isRequired: boolean,
    minSelections: number,
    maxSelections: number,
    sortOrder: number,
    createdAt: Date,
    updatedAt: Date,
    options?: ProductOptionModel[],
  ) {
    super();
    this.id = id;
    this.productId = productId;
    this.name = name;
    this.isRequired = isRequired;
    this.minSelections = minSelections;
    this.maxSelections = maxSelections;
    this.sortOrder = sortOrder;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.options = options;
  }

  public toJson(showHidden = false): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      product_id: this.productId,
      name: this.name,
      is_required: this.isRequired,
      min_selections: this.minSelections,
      max_selections: this.maxSelections,
      sort_order: this.sortOrder,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };

    if (this.options) {
      data.options = this.options.map((o) => o.toJson(showHidden));
    }

    return this.filterHiddenIfNeed(data, showHidden);
  }
}
