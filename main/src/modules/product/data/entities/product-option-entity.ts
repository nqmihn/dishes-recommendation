import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ProductOptionModel } from '../../domain/models/product-option-model';
import { ColumnNumericToNumberTransformer } from 'src/core/transforms/column-numeric-to-number-transform';

const numericTransformer = new ColumnNumericToNumberTransformer();

@Entity('product_options')
export class ProductOptionEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  option_group_id!: string;

  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, transformer: numericTransformer })
  additional_price!: number;

  @Column({ default: false })
  is_default!: boolean;

  @Column({ default: true })
  is_active!: boolean;

  @Column({ default: 0 })
  sort_order!: number;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  toModel(): ProductOptionModel {
    return new ProductOptionModel(
      this.id,
      this.option_group_id,
      this.name,
      this.additional_price,
      this.is_default,
      this.is_active,
      this.sort_order,
      this.created_at,
      this.updated_at,
    );
  }
}
