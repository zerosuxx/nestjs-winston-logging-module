import { format } from 'winston';
import { Format } from 'logform';
import { WinstonModule } from 'nest-winston';
import { Console } from 'winston/lib/winston/transports';
import { WinstonLoggerConfig } from '../types';
import {
  ConsoleFormatter,
  DEFAULT_TEMPLATE,
} from '../formatter/console.formatter';

export class WinstonLoggerFactory {
  static create(config: WinstonLoggerConfig) {
    const formats: Record<WinstonLoggerConfig['format'], Format> = {
      console: this.getConsoleFormat(),
      json: this.getJsonFormat(),
    };

    return WinstonModule.createLogger({
      exitOnError: false,
      level: config.level,
      format: format.combine(
        this.getCommonLoggingFormat(config),
        formats[config.format],
      ),
      transports: [new Console()],
    });
  }

  private static getCommonLoggingFormat(config: WinstonLoggerConfig) {
    return format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS',
      }),
      format.ms(),
      format((info) => {
        info.pid = process.pid;
        info.appName = config.appName;
        return info;
      })(),
    );
  }

  private static getConsoleFormat() {
    const consoleFormatter = new ConsoleFormatter({
      template: DEFAULT_TEMPLATE,
      colors: !process.env.NO_COLORS,
      prettyPrint: true,
    });
    return format.combine(
      format.printf((info) =>
        consoleFormatter.format(info as Record<string, any>),
      ),
    );
  }

  private static getJsonFormat() {
    return format.combine(
      format((info) => {
        info.severity = info.level.toUpperCase();
        return info;
      })(),
      format.json({
        replacer(this: any, key: string, value: any) {
          if (key === 'level') {
            return undefined;
          }
          return value;
        },
      }),
    );
  }
}
