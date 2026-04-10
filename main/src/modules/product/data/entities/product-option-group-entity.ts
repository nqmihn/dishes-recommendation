import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ProductOptionGroupModel } from '../../domain/models/product-option-group-model';

@Entity('product_option_groups')
export class ProductOptionGroupEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  product_id!: string;

  @Column()
  name!: string;

  @Column({ default: false })
  is_required!: boolean;

  @Column({ default: 0 })
  min_selections!: number;

  @Column({ default: 1 })
  max_selections!: number;

  @Column({ default: 0 })
  sort_order!: number;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  toModel(): ProductOptionGroupModel {
    return new ProductOptionGroupModel(
      this.id,
      this.product_id,
      this.name,
      this.is_required,
      this.min_selections,
      this.max_selections,
      this.sort_order,
      this.created_at,
      this.updated_at,
    );
  }
}
