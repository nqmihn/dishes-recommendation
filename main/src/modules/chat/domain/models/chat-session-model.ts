import { DomainModel } from 'src/core/models/domain-model';

export class ChatSessionModel extends DomainModel {
  public readonly id!: string;
  public readonly sessionToken!: string;
  public readonly title?: string;
  public readonly lastMessageAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  constructor(
    id: string,
    sessionToken: string,
    title: string | undefined,
    lastMessageAt: Date | undefined,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.id = id;
    this.sessionToken = sessionToken;
    this.title = title;
    this.lastMessageAt = lastMessageAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public toJson(showHidden = false): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      session_token: this.sessionToken,
      title: this.title,
      last_message_at: this.lastMessageAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };

    return this.filterHiddenIfNeed(data, showHidden);
  }

  protected getHidden(): string[] {
    return [];
  }
}
