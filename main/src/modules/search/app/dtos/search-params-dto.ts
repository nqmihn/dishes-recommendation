import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchParamsDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  q: string | undefined;

  @ApiProperty()
  @Transform((value: any) => parseInt(value.obj?.search_limit))
  @IsNumber()
  @Min(1000)
  @Max(3000)
  @IsOptional()
  search_limit: number | undefined;
}
