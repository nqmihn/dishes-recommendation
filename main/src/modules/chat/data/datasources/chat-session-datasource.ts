import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { ChatSessionEntity } from '../entities/chat-session-entity';
import { ChatSessionModel } from '../../domain/models/chat-session-model';

@Injectable()
export class ChatSessionDatasource {
  constructor(
    @InjectRepository(ChatSessionEntity)
    private readonly repo: Repository<ChatSessionEntity>,
  ) {}

  public async findBySessionToken(sessionToken: string): Promise<ChatSessionModel | undefined> {
    const entity = await this.repo.findOne({ where: { session_token: sessionToken } });
    return entity?.toModel();
  }

  public async create(model: ChatSessionModel): Promise<ChatSessionModel> {
    const entity = this.repo.create({
      id: model.id,
      session_token: model.sessionToken,
      title: model.title,
      last_message_at: model.lastMessageAt,
      created_at: model.createdAt,
      updated_at: model.updatedAt,
    });
    await this.repo.save(entity);
    return entity.toModel();
  }

  public async updateLastMessageAt(id: string, lastMessageAt: Date): Promise<void> {
    await this.repo.update(id, {
      last_message_at: lastMessageAt,
      updated_at: lastMessageAt,
    });
  }

  public async deleteSessionsOlderThan(date: Date): Promise<number> {
    const result = await this.repo.delete({
      last_message_at: LessThan(date),
    });
    return result.affected ?? 0;
  }
}
