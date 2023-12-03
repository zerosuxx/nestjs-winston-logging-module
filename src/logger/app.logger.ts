import { LoggerService } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { LogContext } from '../types';

export class AppLogger implements LoggerService {
  constructor(
    private readonly logger: LoggerService,
    private readonly storage: AsyncLocalStorage<string>,
    private defaultContext?: string,
  ) {}

  runWithRequestId<R>(requestId: string, callback: () => R): R {
    return this.storage.run(requestId, callback);
  }

  setDefaultContext(context: string) {
    this.defaultContext = context;
  }

  error(message: string, stack?: string, context?: LogContext) {
    this.logger.error(this.formatMessage(message, context), stack);
  }

  err(message: string, error: Error, context?: LogContext) {
    const {
      name,
      message: errorMessage,
      stack,
      ...additionalErrorProperties
    } = error;

    this.logger.error(
      {
        ...this.formatMessage(message, context),
        error: { name, message: errorMessage, ...additionalErrorProperties },
      },
      stack,
    );
  }

  warn(message: string, context?: LogContext) {
    this.logger.warn(this.formatMessage(message, context));
  }

  log(message: string, context?: LogContext) {
    this.logger.log(this.formatMessage(message, context));
  }

  info(message: string, context?: LogContext) {
    this.log(message, context);
  }

  verbose(message: any, context?: LogContext) {
    this.logger.verbose!(this.formatMessage(message, context));
  }

  debug(message: any, context?: LogContext) {
    this.logger.debug!(this.formatMessage(message, context));
  }

  private formatMessage(message: string, context?: LogContext) {
    if (typeof context === 'string') {
      context = { context };
    }

    context ??= {};
    if (typeof context.context === 'undefined') {
      context.context = this.defaultContext;
    }

    context.requestId = this.storage.getStore();

    return { message, ...context };
  }
}
