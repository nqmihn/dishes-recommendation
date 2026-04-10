import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class ProductManagementTables1775786380673 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. categories
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'slug', type: 'varchar', isUnique: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'image_url', type: 'varchar', isNullable: true },
          { name: 'parent_id', type: 'varchar', isNullable: true },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'categories',
      new TableForeignKey({
        name: 'fk_categories_parent_id',
        columnNames: ['parent_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createIndex(
      'categories',
      new TableIndex({ name: 'idx_categories_parent_id', columnNames: ['parent_id'] }),
    );

    // 2. products
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'category_id', type: 'varchar' },
          { name: 'name', type: 'varchar' },
          { name: 'slug', type: 'varchar', isUnique: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'short_description', type: 'varchar', isNullable: true },
          { name: 'base_price', type: 'decimal', precision: 12, scale: 2 },
          { name: 'thumbnail_url', type: 'varchar', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'is_featured', type: 'boolean', default: false },
          { name: 'preparation_time', type: 'int', isNullable: true },
          { name: 'calories', type: 'int', isNullable: true },
          { name: 'tags', type: 'jsonb', isNullable: true },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        name: 'fk_products_category_id',
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createIndices('products', [
      new TableIndex({ name: 'idx_products_category_id', columnNames: ['category_id'] }),
      new TableIndex({ name: 'idx_products_is_active_is_featured', columnNames: ['is_active', 'is_featured'] }),
    ]);

    // 3. product_variants
    await queryRunner.createTable(
      new Table({
        name: 'product_variants',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'product_id', type: 'varchar' },
          { name: 'name', type: 'varchar' },
          { name: 'sku', type: 'varchar', isNullable: true, isUnique: true },
          { name: 'price', type: 'decimal', precision: 12, scale: 2 },
          { name: 'original_price', type: 'decimal', precision: 12, scale: 2, isNullable: true },
          { name: 'stock_quantity', type: 'int', default: -1 },
          { name: 'is_default', type: 'boolean', default: false },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'product_variants',
      new TableForeignKey({
        name: 'fk_product_variants_product_id',
        columnNames: ['product_id'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'product_variants',
      new TableIndex({ name: 'idx_product_variants_product_id', columnNames: ['product_id'] }),
    );

    // 4. product_images
    await queryRunner.createTable(
      new Table({
        name: 'product_images',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'product_id', type: 'varchar' },
          { name: 'image_url', type: 'varchar' },
          { name: 'alt_text', type: 'varchar', isNullable: true },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'product_images',
      new TableForeignKey({
        name: 'fk_product_images_product_id',
        columnNames: ['product_id'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'product_images',
      new TableIndex({ name: 'idx_product_images_product_id', columnNames: ['product_id'] }),
    );

    // 5. product_option_groups
    await queryRunner.createTable(
      new Table({
        name: 'product_option_groups',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'product_id', type: 'varchar' },
          { name: 'name', type: 'varchar' },
          { name: 'is_required', type: 'boolean', default: false },
          { name: 'min_selections', type: 'int', default: 0 },
          { name: 'max_selections', type: 'int', default: 1 },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'product_option_groups',
      new TableForeignKey({
        name: 'fk_product_option_groups_product_id',
        columnNames: ['product_id'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'product_option_groups',
      new TableIndex({ name: 'idx_product_option_groups_product_id', columnNames: ['product_id'] }),
    );

    // 6. product_options
    await queryRunner.createTable(
      new Table({
        name: 'product_options',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'option_group_id', type: 'varchar' },
          { name: 'name', type: 'varchar' },
          { name: 'additional_price', type: 'decimal', precision: 12, scale: 2, default: 0 },
          { name: 'is_default', type: 'boolean', default: false },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'product_options',
      new TableForeignKey({
        name: 'fk_product_options_option_group_id',
        columnNames: ['option_group_id'],
        referencedTableName: 'product_option_groups',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'product_options',
      new TableIndex({ name: 'idx_product_options_option_group_id', columnNames: ['option_group_id'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_options', true);
    await queryRunner.dropTable('product_option_groups', true);
    await queryRunner.dropTable('product_images', true);
    await queryRunner.dropTable('product_variants', true);
    await queryRunner.dropTable('products', true);
    await queryRunner.dropTable('categories', true);
  }
}
