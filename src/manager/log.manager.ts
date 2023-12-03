import { AsyncLocalStorage } from 'async_hooks';
import { WinstonLoggerFactory } from '../factory/winston-logger.factory';
import { WinstonLoggerConfig } from '../types';
import { AppLogger } from '../logger/app.logger';
import { LoggerService } from '@nestjs/common';

export class LogManager {
  static create(winstonLoggerConfig: WinstonLoggerConfig) {
    const winstonLogger = WinstonLoggerFactory.create(winstonLoggerConfig);
    const storage = new AsyncLocalStorage<string>();

    return new LogManager(winstonLogger, storage);
  }

  constructor(
    private readonly logger: LoggerService,
    private readonly storage: AsyncLocalStorage<string>,
  ) {}

  createAppLogger(defaultContext?: string) {
    return new AppLogger(this.logger, this.storage, defaultContext);
  }
}
