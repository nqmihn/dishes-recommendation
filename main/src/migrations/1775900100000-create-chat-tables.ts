import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateChatTables1775900100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. chat_sessions
    await queryRunner.createTable(
      new Table({
        name: 'chat_sessions',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'session_token', type: 'varchar', isUnique: true },
          { name: 'title', type: 'varchar', isNullable: true },
          { name: 'last_message_at', type: 'timestamp', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createIndices('chat_sessions', [
      new TableIndex({
        name: 'idx_chat_sessions_session_token',
        columnNames: ['session_token'],
        isUnique: true,
      }),
      new TableIndex({
        name: 'idx_chat_sessions_last_message_at',
        columnNames: ['last_message_at'],
      }),
    ]);

    // 2. chat_messages
    await queryRunner.createTable(
      new Table({
        name: 'chat_messages',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'session_id', type: 'varchar' },
          { name: 'role', type: 'varchar' }, // 'user' | 'assistant'
          { name: 'content', type: 'text' },
          { name: 'metadata', type: 'jsonb', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'chat_messages',
      new TableForeignKey({
        name: 'fk_chat_messages_session_id',
        columnNames: ['session_id'],
        referencedTableName: 'chat_sessions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'chat_messages',
      new TableIndex({
        name: 'idx_chat_messages_session_id_created_at',
        columnNames: ['session_id', 'created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('chat_messages', true);
    await queryRunner.dropTable('chat_sessions', true);
  }
}
