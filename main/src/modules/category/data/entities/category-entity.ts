import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CategoryModel } from '../../domain/models/category-model';

@Entity('categories')
export class CategoryEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  image_url?: string;

  @Column({ nullable: true })
  parent_id?: string;

  @Column({ default: 0 })
  sort_order!: number;

  @Column({ default: true })
  is_active!: boolean;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  toModel(): CategoryModel {
    return new CategoryModel(
      this.id,
      this.name,
      this.slug,
      this.description,
      this.image_url,
      this.parent_id,
      this.sort_order,
      this.is_active,
      this.created_at,
      this.updated_at,
    );
  }
}
