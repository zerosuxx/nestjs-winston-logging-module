import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LoggingModule } from '../../src/logging.module';
import { Console } from 'winston/lib/winston/transports';
import { TestController } from '../fixture/test-controller';
import { AppLogger } from '../../src/logger/app.logger';

const originalConsoleLog = Console.prototype.log;

describe('LoggingModule (e2e)', () => {
  let app: INestApplication;
  let consoleLogMock: jest.Mock;

  beforeEach(async () => {
    consoleLogMock = jest.fn().mockImplementation((_, cb) => cb());
    Console.prototype.log = consoleLogMock;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LoggingModule.register({
          global: true,
          winstonLoggerConfig: {
            format: 'json',
            level: 'debug',
            appName: 'e2e-test',
          },
        }),
      ],
      controllers: [TestController],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(app.get(AppLogger));

    await app.init();
  });

  afterEach(() => {
    Console.prototype.log = originalConsoleLog;
  });

  it('/ (GET)', () => {
    const result = request(app.getHttpServer()).get('/').expect(200);

    expect(consoleLogMock).toHaveBeenCalledTimes(3);

    return result;
  });
});
