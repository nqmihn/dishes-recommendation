import { Controller, Get } from '@nestjs/common';
import { GetServiceInformationUsecase } from '../../../../domain/usecases/get-service-information.usecase';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Public \\ Welcome')
@Controller()
export class AppController {
  constructor(private readonly appService: GetServiceInformationUsecase) {}

  /**
   * Welcome
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
