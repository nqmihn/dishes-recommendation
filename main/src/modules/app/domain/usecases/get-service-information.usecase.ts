import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetServiceInformationUsecase {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return `${this.configService.get<string>('app.name') ?? 'Unknown'} - ${new Date()}`;
  }
}
