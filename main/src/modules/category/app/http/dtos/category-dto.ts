import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationParamsDto } from 'src/core/dtos/pagination-params-dto';
import { SortParamsDto } from 'src/core/dtos/sort-params-dto';
import { parseBoolean } from 'src/core/helpers/utils';

// --- Create ---
export class CreateCategoryDto {
  @ApiProperty({ example: 'Trà sữa' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'tra-sua' })
  @IsString()
  slug!: string;

  @ApiPropertyOptional({ example: 'Các loại trà sữa thơm ngon' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional({ example: null, description: 'Parent category ID for nested categories' })
  @IsOptional()
  @IsString()
  parent_id?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_active, false))
  @IsBoolean()
  is_active?: boolean;
}

// --- Update ---
export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Trà sữa' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'tra-sua' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Các loại trà sữa thơm ngon' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  parent_id?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_active, false))
  @IsBoolean()
  is_active?: boolean;
}

// --- List Query ---
export class ListCategoryQueryDto extends PaginationParamsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dir?: string;

  @ApiPropertyOptional({ description: 'Search by name or slug' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by parent_id (use "null" for root categories)' })
  @IsOptional()
  @IsString()
  parent_id?: string;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_active, false))
  @IsBoolean()
  is_active?: boolean;
}
