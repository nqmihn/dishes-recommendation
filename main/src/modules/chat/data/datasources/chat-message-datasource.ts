import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessageEntity } from '../entities/chat-message-entity';
import { ChatMessageModel } from '../../domain/models/chat-message-model';

@Injectable()
export class ChatMessageDatasource {
  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly repo: Repository<ChatMessageEntity>,
  ) {}

  public async findBySessionId(sessionId: string, limit = 50): Promise<ChatMessageModel[]> {
    const entities = await this.repo.find({
      where: { session_id: sessionId },
      order: { created_at: 'ASC' },
      take: limit,
    });
    return entities.map((e) => e.toModel());
  }

  public async create(model: ChatMessageModel): Promise<ChatMessageModel> {
    const entity = this.repo.create({
      id: model.id,
      session_id: model.sessionId,
      role: model.role,
      content: model.content,
      metadata: model.metadata,
      created_at: model.createdAt,
    });
    await this.repo.save(entity);
    return entity.toModel();
  }

  public async deleteBySessionId(sessionId: string): Promise<void> {
    await this.repo.delete({ session_id: sessionId });
  }
}
