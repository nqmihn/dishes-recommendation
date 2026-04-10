import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateFormat } from '../decorators/is-date-format';
import { SkipUndefined } from '../decorators/skip-undefined';

export class DateFilterParamsDto {
  @ApiPropertyOptional({ description: 'From date filter', example: '2025-10-10T00:00:00+07:00' })
  @SkipUndefined()
  @IsDateFormat(`yyyy-MM-dd'T'HH:mm:ssXXX`)
  from_date: Date | undefined;

  @ApiPropertyOptional({ description: 'To date filter', example: '2025-10-31T23:59:59+07:00' })
  @SkipUndefined()
  @IsDateFormat(`yyyy-MM-dd'T'HH:mm:ssXXX`)
  to_date: Date | undefined;
}
