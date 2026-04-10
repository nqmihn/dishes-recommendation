import { ObjectCopier } from './object-copier';
import { RuntimeException } from '@nestjs/core/errors/exceptions';

export abstract class DomainModel extends ObjectCopier {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromJson(jsonData: Record<string, any>): any {
    throw new RuntimeException('Method not implemented.');
  }

  public abstract toJson(showHidden: boolean): Record<string, any>;

  protected filterHiddenIfNeed(data: Record<string, any>, showHidden = false): Record<string, any> {
    if (!showHidden) {
      this.getHidden().forEach((key: string) => {
        delete data[key];
      });
    }
    return data;
  }

  protected getHidden(): string[] {
    return [];
  }
}
