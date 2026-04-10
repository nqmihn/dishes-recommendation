import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateProductDocumentsTable1775900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Enable pgvector extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);

    // 2. Create product_documents table
    await queryRunner.createTable(
      new Table({
        name: 'product_documents',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'product_id', type: 'varchar', isUnique: true },
          { name: 'product_name', type: 'varchar' },
          { name: 'document', type: 'text' },
          { name: 'embedding', type: 'vector(384)', isNullable: true },
          { name: 'metadata', type: 'jsonb', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // 3. Create indexes
    await queryRunner.createIndices('product_documents', [
      new TableIndex({
        name: 'idx_product_documents_product_id',
        columnNames: ['product_id'],
        isUnique: true,
      }),
    ]);

    // 4. Create HNSW index for fast cosine similarity search
    await queryRunner.query(
      `CREATE INDEX idx_product_documents_embedding ON product_documents USING hnsw (embedding vector_cosine_ops)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_product_documents_embedding`);
    await queryRunner.dropTable('product_documents', true);
    await queryRunner.query(`DROP EXTENSION IF EXISTS vector`);
  }
}
