import { Expose } from 'class-transformer';

export class PageList<T> {
  public readonly page: number;

  @Expose({ name: 'total_count' })
  public readonly totalCount: number | undefined;

  public readonly data: T[];

  constructor(page: number, totalCount: number | undefined, data: T[]) {
    this.page = page;
    this.totalCount = totalCount;
    this.data = data;
  }
}
