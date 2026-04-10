import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ChatMessageModel } from '../../domain/models/chat-message-model';

@Entity('chat_messages')
export class ChatMessageEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  session_id!: string;

  @Column()
  role!: string; // 'user' | 'assistant'

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column()
  created_at!: Date;

  toModel(): ChatMessageModel {
    return new ChatMessageModel(
      this.id,
      this.session_id,
      this.role,
      this.content,
      this.metadata,
      this.created_at,
    );
  }
}
