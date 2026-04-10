import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { SortDir } from '../enums/sort-dir';
import { ApiProperty } from '@nestjs/swagger';

export class SortParamsDto {
  @ApiProperty()
  @IsString()
  sort!: string;

  @ApiProperty({ enum: SortDir })
  @Transform((value: any) => value.obj?.dir?.toUpperCase())
  @IsEnum(SortDir)
  dir!: SortDir;
}
