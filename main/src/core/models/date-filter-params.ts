export class DateFilterParams {
  public readonly from: Date | undefined;
  public readonly to: Date | undefined;
  public readonly column: string | undefined;

  constructor(from: Date | undefined, to: Date | undefined, column: string | undefined) {
    this.from = from;
    this.to = to;
    this.column = column;
  }
}
