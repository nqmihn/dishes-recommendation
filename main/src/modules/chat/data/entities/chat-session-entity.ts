import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ChatSessionModel } from '../../domain/models/chat-session-model';

@Entity('chat_sessions')
export class ChatSessionEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ unique: true })
  session_token!: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  last_message_at?: Date;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  toModel(): ChatSessionModel {
    return new ChatSessionModel(
      this.id,
      this.session_token,
      this.title,
      this.last_message_at,
      this.created_at,
      this.updated_at,
    );
  }
}
