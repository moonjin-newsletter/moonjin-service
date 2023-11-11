import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as process from 'process';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly configService :ConfigService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
