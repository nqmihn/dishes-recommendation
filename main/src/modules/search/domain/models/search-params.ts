import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchParams {
  @ApiPropertyOptional()
  public readonly query: string | undefined;

  @ApiProperty()
  public readonly limit: number;

  @ApiPropertyOptional()
  public readonly searchableKey: string[] | undefined;

  constructor(query: string | undefined, searchLimit: number | undefined, searchableKey: string[] | undefined) {
    this.query = query;
    this.limit = searchLimit ?? 3000;
    this.searchableKey = searchableKey;
  }
}
