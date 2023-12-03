import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { InjectAppLogger } from '../decorator/inject-app-logger.decorator';
import { AppLogger } from '../logger/app.logger';
import { HEADER_REQUEST_ID } from '../types';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectAppLogger(LoggerMiddleware.name) private logger: AppLogger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    req.headers[HEADER_REQUEST_ID] ??= randomUUID();

    this.logger.runWithRequestId(req.header(HEADER_REQUEST_ID)!, () => {
      this.logger.info('Incoming request', {
        request: {
          method: req.method,
          url: req.url,
        },
      });
      next();
    });
  }
}
