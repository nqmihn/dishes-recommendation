import { Injectable } from '@nestjs/common';
import { ChatSessionRepository } from '../repositories/chat-session-repository';
import { ChatMessageRepository } from '../repositories/chat-message-repository';
import { ChatMessageModel } from '../models/chat-message-model';

export interface ChatHistoryResponse {
  session_token: string;
  title?: string;
  messages: Record<string, any>[];
}

@Injectable()
export class GetChatHistoryUsecase {
  constructor(
    private readonly chatSessionRepository: ChatSessionRepository,
    private readonly chatMessageRepository: ChatMessageRepository,
  ) {}

  public async call(sessionToken: string): Promise<ChatHistoryResponse | null> {
    const session = await this.chatSessionRepository.findBySessionToken(sessionToken);
    if (!session) {
      return null;
    }

    const messages = await this.chatMessageRepository.findBySessionId(session.id);

    return {
      session_token: session.sessionToken,
      title: session.title,
      messages: messages.map((msg) => msg.toJson()),
    };
  }
}
