import { ChatSessionModel } from '../models/chat-session-model';

export abstract class ChatSessionRepository {
  public abstract findBySessionToken(sessionToken: string): Promise<ChatSessionModel | undefined>;
  public abstract create(session: ChatSessionModel): Promise<ChatSessionModel>;
  public abstract updateLastMessageAt(id: string, lastMessageAt: Date): Promise<void>;
  public abstract deleteSessionsOlderThan(date: Date): Promise<number>;
}
