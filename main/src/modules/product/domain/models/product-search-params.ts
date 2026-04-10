export class ProductSearchParams {
  public readonly search: string | undefined;
  public readonly categoryId: string | undefined;
  public readonly isActive: boolean | undefined;
  public readonly isFeatured: boolean | undefined;
  public readonly tags: string[] | undefined;

  constructor(
    search: string | undefined,
    categoryId: string | undefined,
    isActive: boolean | undefined,
    isFeatured: boolean | undefined,
    tags: string[] | undefined,
  ) {
    this.search = search;
    this.categoryId = categoryId;
    this.isActive = isActive;
    this.isFeatured = isFeatured;
    this.tags = tags;
  }
}
