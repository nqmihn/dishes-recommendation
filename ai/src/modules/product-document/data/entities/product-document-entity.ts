import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { ProductDocumentModel } from '../../domain/models/product-document-model';

@Entity('product_documents')
export class ProductDocumentEntity {
  @PrimaryColumn()
  id!: string;

  @Index('idx_product_documents_product_id', { unique: true })
  @Column()
  product_id!: string;

  @Column()
  product_name!: string;

  @Column({ type: 'text' })
  document!: string;

  @Column({ type: 'vector', nullable: true })
  embedding?: string; // pgvector stores as string in TypeORM, will be cast

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  toModel(): ProductDocumentModel {
    return new ProductDocumentModel(
      this.id,
      this.product_id,
      this.product_name,
      this.document,
      this.embedding ? JSON.parse(this.embedding) : undefined,
      this.metadata,
      this.created_at,
      this.updated_at,
    );
  }
}
