import { DomainModel } from 'src/core/models/domain-model';

export class ProductDocumentModel extends DomainModel {
  public readonly id!: string;
  public readonly productId!: string;
  public readonly productName!: string;
  public readonly document!: string;
  public readonly embedding!: number[] | undefined;
  public readonly metadata!: Record<string, any> | undefined;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  constructor(
    id: string,
    productId: string,
    productName: string,
    document: string,
    embedding: number[] | undefined,
    metadata: Record<string, any> | undefined,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.id = id;
    this.productId = productId;
    this.productName = productName;
    this.document = document;
    this.embedding = embedding;
    this.metadata = metadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public toJson(showHidden = false): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      product_id: this.productId,
      product_name: this.productName,
      document: this.document,
      metadata: this.metadata,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };

    return this.filterHiddenIfNeed(data, showHidden);
  }

  protected getHidden(): string[] {
    return ['embedding'];
  }
}
