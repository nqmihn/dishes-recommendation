import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendChatMessageDto {
  @ApiPropertyOptional({ description: 'Session token for continuing conversation. Omit to start new session.' })
  @IsOptional()
  @IsString()
  session_token?: string;

  @ApiProperty({ description: 'User message' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  message!: string;
}
