import { DomainModel } from 'src/core/models/domain-model';

export class ProductOptionModel extends DomainModel {
  public readonly id!: string;
  public readonly optionGroupId!: string;
  public readonly name!: string;
  public readonly additionalPrice!: number;
  public readonly isDefault!: boolean;
  public readonly isActive!: boolean;
  public readonly sortOrder!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  constructor(
    id: string,
    optionGroupId: string,
    name: string,
    additionalPrice: number,
    isDefault: boolean,
    isActive: boolean,
    sortOrder: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.id = id;
    this.optionGroupId = optionGroupId;
    this.name = name;
    this.additionalPrice = additionalPrice;
    this.isDefault = isDefault;
    this.isActive = isActive;
    this.sortOrder = sortOrder;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public toJson(showHidden = false): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      option_group_id: this.optionGroupId,
      name: this.name,
      additional_price: this.additionalPrice,
      is_default: this.isDefault,
      is_active: this.isActive,
      sort_order: this.sortOrder,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };

    return this.filterHiddenIfNeed(data, showHidden);
  }
}
