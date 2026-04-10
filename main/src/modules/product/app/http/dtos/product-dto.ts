import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationParamsDto } from 'src/core/dtos/pagination-params-dto';
import { parseBoolean } from 'src/core/helpers/utils';

// ===================== PRODUCT =====================

export class CreateProductDto {
  @ApiProperty({ example: 'category-uuid' })
  @IsString()
  category_id!: string;

  @ApiProperty({ example: 'Phở bò tái' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'pho-bo-tai' })
  @IsString()
  slug!: string;

  @ApiPropertyOptional({ example: 'Phở bò tái chín ngon xuất sắc' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Phở bò đặc biệt' })
  @IsOptional()
  @IsString()
  short_description?: string;

  @ApiProperty({ example: 55000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  base_price!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_active, false))
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_featured, false))
  @IsBoolean()
  is_featured?: boolean;

  @ApiPropertyOptional({ example: 15, description: 'Preparation time in minutes' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  preparation_time?: number;

  @ApiPropertyOptional({ example: 450 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  calories?: number;

  @ApiPropertyOptional({ example: ['spicy', 'bestseller'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort_order?: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  short_description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  base_price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_active, false))
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_featured, false))
  @IsBoolean()
  is_featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  preparation_time?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  calories?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort_order?: number;
}

export class ListProductQueryDto extends PaginationParamsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dir?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_active, false))
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_featured, false))
  @IsBoolean()
  is_featured?: boolean;

  @ApiPropertyOptional({ type: [String], description: 'Filter by tags (comma-separated)' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',').map((t: string) => t.trim()) : value))
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

// ===================== VARIANT =====================

export class CreateProductVariantDto {
  @ApiProperty({ example: 'Size L' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'PHO-L-001' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: 65000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ example: 70000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  original_price?: number;

  @ApiPropertyOptional({ example: -1, description: '-1 = unlimited' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stock_quantity?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_default, false))
  @IsBoolean()
  is_default?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_active, false))
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort_order?: number;
}

export class UpdateProductVariantDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  original_price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stock_quantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_default, false))
  @IsBoolean()
  is_default?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_active, false))
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort_order?: number;
}

// ===================== IMAGE =====================

export class CreateProductImageDto {
  @ApiProperty({ example: 'https://example.com/pho.jpg' })
  @IsString()
  image_url!: string;

  @ApiPropertyOptional({ example: 'Phở bò tái' })
  @IsOptional()
  @IsString()
  alt_text?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort_order?: number;
}

// ===================== OPTION GROUP =====================

export class CreateProductOptionGroupDto {
  @ApiProperty({ example: 'Chọn size' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_required, false))
  @IsBoolean()
  is_required?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  min_selections?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  max_selections?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort_order?: number;
}

export class UpdateProductOptionGroupDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_required, false))
  @IsBoolean()
  is_required?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  min_selections?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  max_selections?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort_order?: number;
}

// ===================== OPTION =====================

export class CreateProductOptionDto {
  @ApiProperty({ example: 'Trân châu đen' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  additional_price?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_default, false))
  @IsBoolean()
  is_default?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_active, false))
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort_order?: number;
}

export class UpdateProductOptionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  additional_price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_default, false))
  @IsBoolean()
  is_default?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.is_active, false))
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort_order?: number;
}
