import { Injectable } from '@nestjs/common';
import { ChatMessageRepository } from '../../domain/repositories/chat-message-repository';
import { ChatMessageDatasource } from '../datasources/chat-message-datasource';
import { ChatMessageModel } from '../../domain/models/chat-message-model';

@Injectable()
export class ChatMessageRepositoryImpl extends ChatMessageRepository {
  constructor(private readonly datasource: ChatMessageDatasource) {
    super();
  }

  public async findBySessionId(sessionId: string, limit?: number): Promise<ChatMessageModel[]> {
    return this.datasource.findBySessionId(sessionId, limit);
  }

  public async create(message: ChatMessageModel): Promise<ChatMessageModel> {
    return this.datasource.create(message);
  }

  public async deleteBySessionId(sessionId: string): Promise<void> {
    return this.datasource.deleteBySessionId(sessionId);
  }
}
