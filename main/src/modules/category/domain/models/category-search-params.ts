export class CategorySearchParams {
  public readonly search: string | undefined;
  public readonly parentId: string | undefined;
  public readonly isActive: boolean | undefined;

  constructor(
    search: string | undefined,
    parentId: string | undefined,
    isActive: boolean | undefined,
  ) {
    this.search = search;
    this.parentId = parentId;
    this.isActive = isActive;
  }
}
