import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ProductVariantModel } from '../../domain/models/product-variant-model';
import { ColumnNumericToNumberTransformer } from 'src/core/transforms/column-numeric-to-number-transform';

const numericTransformer = new ColumnNumericToNumberTransformer();

@Entity('product_variants')
export class ProductVariantEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  product_id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  sku?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, transformer: numericTransformer })
  price!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, transformer: numericTransformer })
  original_price?: number;

  @Column({ default: -1 })
  stock_quantity!: number;

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

  toModel(): ProductVariantModel {
    return new ProductVariantModel(
      this.id,
      this.product_id,
      this.name,
      this.sku,
      this.price,
      this.original_price,
      this.stock_quantity,
      this.is_default,
      this.is_active,
      this.sort_order,
      this.created_at,
      this.updated_at,
    );
  }
}
