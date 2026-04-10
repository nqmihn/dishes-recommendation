import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDocumentEntity } from '../entities/product-document-entity';
import { ProductDocumentModel } from '../../domain/models/product-document-model';

@Injectable()
export class ProductDocumentDatasource {
  constructor(
    @InjectRepository(ProductDocumentEntity)
    private readonly repo: Repository<ProductDocumentEntity>,
  ) {}

  public async upsert(model: ProductDocumentModel): Promise<void> {
    const embeddingValue = model.embedding ? JSON.stringify(model.embedding) : null;

    // Use raw query for pgvector casting
    await this.repo.query(
      `INSERT INTO product_documents (id, product_id, product_name, document, embedding, metadata, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5::vector, $6::jsonb, $7, $8)
       ON CONFLICT (product_id)
       DO UPDATE SET
         product_name = EXCLUDED.product_name,
         document = EXCLUDED.document,
         embedding = EXCLUDED.embedding,
         metadata = EXCLUDED.metadata,
         updated_at = EXCLUDED.updated_at`,
      [
        model.id,
        model.productId,
        model.productName,
        model.document,
        embeddingValue,
        model.metadata ? JSON.stringify(model.metadata) : null,
        model.createdAt,
        model.updatedAt,
      ],
    );
  }

  public async findByProductId(productId: string): Promise<ProductDocumentModel | undefined> {
    const entity = await this.repo.findOne({ where: { product_id: productId } });
    return entity?.toModel();
  }

  /**
   * Find similar documents using cosine distance (pgvector <=> operator).
   */
  public async findSimilar(embedding: number[], limit: number): Promise<ProductDocumentModel[]> {
    const embeddingStr = JSON.stringify(embedding);

    const entities = await this.repo.query(
      `SELECT *, (embedding <=> $1::vector) AS distance
       FROM product_documents
       WHERE embedding IS NOT NULL
       ORDER BY distance ASC
       LIMIT $2`,
      [embeddingStr, limit],
    );

    return entities.map((row: any) => {
      const entity = Object.assign(new ProductDocumentEntity(), row);
      return entity.toModel();
    });
  }

  public async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
