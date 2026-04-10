import { Injectable } from '@nestjs/common';
import { ChatSessionRepository } from '../../domain/repositories/chat-session-repository';
import { ChatSessionDatasource } from '../datasources/chat-session-datasource';
import { ChatSessionModel } from '../../domain/models/chat-session-model';

@Injectable()
export class ChatSessionRepositoryImpl extends ChatSessionRepository {
  constructor(private readonly datasource: ChatSessionDatasource) {
    super();
  }

  public async findBySessionToken(sessionToken: string): Promise<ChatSessionModel | undefined> {
    return this.datasource.findBySessionToken(sessionToken);
  }

  public async create(session: ChatSessionModel): Promise<ChatSessionModel> {
    return this.datasource.create(session);
  }

  public async updateLastMessageAt(id: string, lastMessageAt: Date): Promise<void> {
    return this.datasource.updateLastMessageAt(id, lastMessageAt);
  }

  public async deleteSessionsOlderThan(date: Date): Promise<number> {
    return this.datasource.deleteSessionsOlderThan(date);
  }
}
