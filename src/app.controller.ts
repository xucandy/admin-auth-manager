import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @ApiBearerAuth()
  @ApiOperation({ description: '返回hello word' })
  getHello(): string {
    return this.appService.getHello();
  }
}
