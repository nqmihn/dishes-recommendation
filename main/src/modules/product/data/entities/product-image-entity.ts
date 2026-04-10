import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ProductImageModel } from '../../domain/models/product-image-model';

@Entity('product_images')
export class ProductImageEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  product_id!: string;

  @Column()
  image_url!: string;

  @Column({ nullable: true })
  alt_text?: string;

  @Column({ default: 0 })
  sort_order!: number;

  @Column()
  created_at!: Date;

  toModel(): ProductImageModel {
    return new ProductImageModel(
      this.id,
      this.product_id,
      this.image_url,
      this.alt_text,
      this.sort_order,
      this.created_at,
    );
  }
}
