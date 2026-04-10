import { ProductDocumentModel } from '../models/product-document-model';

export abstract class ProductDocumentRepository {
  public abstract upsertByProductId(document: ProductDocumentModel): Promise<ProductDocumentModel>;
  public abstract findByProductId(productId: string): Promise<ProductDocumentModel | undefined>;
  public abstract findSimilar(embedding: number[], limit: number): Promise<ProductDocumentModel[]>;
  public abstract delete(id: string): Promise<void>;
}
