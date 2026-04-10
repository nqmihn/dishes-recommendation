export class SortParams {
  public readonly sort: string;

  public readonly dir: 'ASC' | 'DESC';

  constructor(sort: string | undefined, dir: string | undefined) {
    this.sort = sort ?? 'created_at';
    this.dir = <'ASC' | 'DESC'>dir?.toUpperCase() ?? 'ASC';
  }
}
