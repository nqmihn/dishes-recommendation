import { Injectable } from '@nestjs/common';
import { ProductDocumentRepository } from '../../domain/repositories/product-document-repository';
import { ProductDocumentDatasource } from '../datasources/product-document-datasource';
import { ProductDocumentModel } from '../../domain/models/product-document-model';

@Injectable()
export class ProductDocumentRepositoryImpl extends ProductDocumentRepository {
  constructor(private readonly datasource: ProductDocumentDatasource) {
    super();
  }

  public async upsertByProductId(document: ProductDocumentModel): Promise<ProductDocumentModel> {
    await this.datasource.upsert(document);
    return document;
  }

  public async findByProductId(productId: string): Promise<ProductDocumentModel | undefined> {
    return await this.datasource.findByProductId(productId);
  }

  public async findSimilar(embedding: number[], limit: number): Promise<ProductDocumentModel[]> {
    return await this.datasource.findSimilar(embedding, limit);
  }

  public async delete(id: string): Promise<void> {
    await this.datasource.delete(id);
  }
}
