export class ColumnNumericToNumberTransformer {
  to(data: number | undefined): number | undefined {
    return data;
  }

  from(data: string | undefined | null): number | null | undefined {
    return data === null || data === undefined ? data : parseFloat(data);
  }
}
