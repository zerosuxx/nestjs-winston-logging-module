import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { LoggingModuleConfig } from './types';
import { AppLoggerProviderRegister } from './register/app-logger-provider.register';
import { LogManager } from './manager/log.manager';
import { AppLogger } from './logger/app.logger';

@Module({})
export class LoggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  static register(
    config: LoggingModuleConfig = {
      global: true,
      winstonLoggerConfig: {
        level: 'info',
        format: 'json',
      },
    },
  ): DynamicModule {
    const logManager =
      'logManager' in config
        ? config.logManager
        : LogManager.create(config.winstonLoggerConfig);
    const appLoggerProvider = {
      provide: AppLogger,
      useValue: logManager.createAppLogger(),
    };

    return {
      global: config.global,
      module: LoggingModule,
      exports: [appLoggerProvider, ...AppLoggerProviderRegister.getProviders()],
      providers: [
        appLoggerProvider,
        ...AppLoggerProviderRegister.getProviders(),
        {
          provide: LogManager,
          useValue: logManager,
        },
      ],
    };
  }
}
