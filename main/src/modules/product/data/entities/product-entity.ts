import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ProductModel } from '../../domain/models/product-model';
import { ColumnNumericToNumberTransformer } from 'src/core/transforms/column-numeric-to-number-transform';

const numericTransformer = new ColumnNumericToNumberTransformer();

@Entity('products')
export class ProductEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  category_id!: string;

  @Column()
  name!: string;

  @Column()
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  short_description?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, transformer: numericTransformer })
  base_price!: number;

  @Column({ nullable: true })
  thumbnail_url?: string;

  @Column({ default: true })
  is_active!: boolean;

  @Column({ default: false })
  is_featured!: boolean;

  @Column({ type: 'int', nullable: true })
  preparation_time?: number;

  @Column({ type: 'int', nullable: true })
  calories?: number;

  @Column({ type: 'jsonb', nullable: true })
  tags?: string[];

  @Column({ default: 0 })
  sort_order!: number;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  toModel(): ProductModel {
    return new ProductModel(
      this.id,
      this.category_id,
      this.name,
      this.slug,
      this.description,
      this.short_description,
      this.base_price,
      this.thumbnail_url,
      this.is_active,
      this.is_featured,
      this.preparation_time,
      this.calories,
      this.tags,
      this.sort_order,
      this.created_at,
      this.updated_at,
    );
  }
}
