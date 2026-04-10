import { ChatMessageModel } from '../models/chat-message-model';

export abstract class ChatMessageRepository {
  public abstract findBySessionId(sessionId: string, limit?: number): Promise<ChatMessageModel[]>;
  public abstract create(message: ChatMessageModel): Promise<ChatMessageModel>;
  public abstract deleteBySessionId(sessionId: string): Promise<void>;
}
