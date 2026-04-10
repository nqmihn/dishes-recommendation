export class PageParams {
  public readonly page: number;

  public readonly limit: number;

  public readonly needTotalCount: boolean;

  public readonly onlyCount: boolean;

  constructor(
    page: number | undefined,
    limit: number | undefined,
    needTotalCount: boolean | undefined,
    onlyCount: boolean | undefined,
  ) {
    this.page = page ?? 1;
    this.limit = limit ?? 10;
    this.needTotalCount = needTotalCount == undefined ? true : needTotalCount;
    this.onlyCount = onlyCount == undefined ? false : onlyCount;
  }
}
