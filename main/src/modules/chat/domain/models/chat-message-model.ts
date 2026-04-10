import { DomainModel } from 'src/core/models/domain-model';

export class ChatMessageModel extends DomainModel {
  public readonly id!: string;
  public readonly sessionId!: string;
  public readonly role!: string;
  public readonly content!: string;
  public readonly metadata?: Record<string, any>;
  public readonly createdAt!: Date;

  constructor(
    id: string,
    sessionId: string,
    role: string,
    content: string,
    metadata: Record<string, any> | undefined,
    createdAt: Date,
  ) {
    super();
    this.id = id;
    this.sessionId = sessionId;
    this.role = role;
    this.content = content;
    this.metadata = metadata;
    this.createdAt = createdAt;
  }

  public toJson(showHidden = false): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      session_id: this.sessionId,
      role: this.role,
      content: this.content,
      metadata: this.metadata,
      created_at: this.createdAt,
    };

    return this.filterHiddenIfNeed(data, showHidden);
  }

  protected getHidden(): string[] {
    return [];
  }
}
