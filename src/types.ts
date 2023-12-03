import { LogManager } from './manager/log.manager';

export const HEADER_REQUEST_ID = 'x-request-id' as const;

export type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug';

export type LoggingModuleConfig = {
  global: boolean;
} & (LoggingModuleWinstonLoggerConfig | LoggingModuleLogManagerConfig);

export type LoggingModuleWinstonLoggerConfig = {
  winstonLoggerConfig: WinstonLoggerConfig;
};

export type LoggingModuleLogManagerConfig = {
  logManager: LogManager;
};

export type WinstonLoggerConfig = {
  format: 'console' | 'json';
  level: LogLevel;
  appName?: string;
};

export type LogContext = Record<string, any> | string;
