import { Controller, Get, Logger } from '@nestjs/common';
import { AppLogger } from '../../src/logger/app.logger';

@Controller()
export class TestController {
  private readonly nestLogger = new Logger(TestController.name);
  constructor(private readonly logger: AppLogger) {}

  @Get()
  getHello() {
    this.nestLogger.log('hello from nestLogger');
    this.logger.log('hello from AppLogger');

    return '';
  }
}
