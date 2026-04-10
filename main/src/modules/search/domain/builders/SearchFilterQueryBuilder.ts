export class SearchFilterQueryBuilder {
  private whereQuery: string | undefined;

  constructor() {
    this.whereQuery = undefined;
  }

  public getWhereQuery(): string | undefined {
    return this.whereQuery;
  }

  private addWhere(field: string, operator: string, value: any, boolean: 'AND' | 'OR'): void {
    if (this.whereQuery) {
      this.whereQuery = `${this.whereQuery} ${boolean} ${field} ${operator} ${value}`;
    } else {
      this.whereQuery = `${field} ${operator} ${value}`;
    }
  }

  public where(field: string, operator: string, value: any): SearchFilterQueryBuilder {
    this.addWhere(field, operator, value, 'AND');

    return this;
  }

  public orWhere(field: string, operator: string, value: any): SearchFilterQueryBuilder {
    this.addWhere(field, operator, value, 'OR');

    return this;
  }

  private addWhereNested(callback: (builder: SearchFilterQueryBuilder) => void, boolean: 'AND' | 'OR'): void {
    const builder = new SearchFilterQueryBuilder();
    callback(builder);

    if (this.whereQuery) {
      this.whereQuery = `${this.whereQuery} ${boolean} (${builder.getWhereQuery()})`;
    } else {
      this.whereQuery = `(${builder.getWhereQuery()})`;
    }
  }

  public whereNested(callback: (builder: SearchFilterQueryBuilder) => void): SearchFilterQueryBuilder {
    this.addWhereNested(callback, 'AND');

    return this;
  }

  public orWhereNested(callback: (builder: SearchFilterQueryBuilder) => void): SearchFilterQueryBuilder {
    this.addWhereNested(callback, 'OR');

    return this;
  }
}
