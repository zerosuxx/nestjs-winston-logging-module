import safeStringify from 'fast-safe-stringify';
import { inspect } from 'util';

export const DEFAULT_TEMPLATE =
  '{appName}{pid}{timestamp}{level}{context}{message}{meta}{ms}';

export class ConsoleFormatter {
  private colorSchema = {
    error: '1;31',
    warn: '1;35',
    info: '1;32',
    verbose: '96',
    debug: '36',

    context: '1;34',
    pid: '37',
    timestamp: '37',
    ms: '38;5;245',
  };

  constructor(
    private readonly config: {
      template: string;
      colors: boolean;
      prettyPrint: boolean;
    } = {
      template: DEFAULT_TEMPLATE,
      colors: true,
      prettyPrint: true,
    },
  ) {}

  format({
    context,
    level,
    timestamp,
    message,
    ms,
    appName,
    pid,
    ...meta
  }: Record<string, any>) {
    const formattedMeta = this.getFormattedMeta(meta);

    return this.config.template
      .replaceAll(
        '{context}',
        this.sanitizeString(
          context,
          (v) => `${this.colorize('context', `[${v}]`)} `,
        ),
      )
      .replaceAll(
        '{level}',
        this.sanitizeString(
          level,
          (v) => `${this.colorize(v, v.toUpperCase().padEnd(7))} `,
        ),
      )
      .replaceAll(
        '{timestamp}',
        this.sanitizeString(
          timestamp,
          (v) => `${this.colorize('timestamp', v)} `,
        ),
      )
      .replaceAll(
        '{message}',
        this.sanitizeString(message, (v) => `${this.colorize('message', v)} `),
      )
      .replaceAll(
        '{ms}',
        this.sanitizeString(ms, (v) => `${this.colorize('ms', v)} `),
      )
      .replaceAll(
        '{pid}',
        this.sanitizeString(
          pid,
          (v) => `${this.colorize('pid', v.padEnd(6))} `,
        ),
      )
      .replaceAll(
        '{appName}',
        this.sanitizeString(
          appName,
          (v) => `${this.colorize(level, `[${v}]`)} `,
        ),
      )
      .replaceAll(
        '{meta}',
        this.sanitizeString(formattedMeta, (v) =>
          v !== '{}' ? `- ${v} ` : '',
        ),
      );
  }

  private getFormattedMeta(meta: Record<string, any>) {
    const safeMeta = safeStringify(meta);

    return this.config.prettyPrint
      ? inspect(JSON.parse(safeMeta), {
          colors: this.config.colors,
          depth: null,
        })
      : safeMeta;
  }

  private colorize(key: string, text: string) {
    if (!this.config.colors || !this.colorSchema[key]) {
      return text;
    }

    const colorCode = this.colorSchema[key];

    return colorCode ? `\x1B[${colorCode}m${text}\x1B[0m` : text;
  }

  private sanitizeString(
    value: any,
    valueGenerator: (value: string) => string,
  ) {
    if (typeof value === 'undefined') {
      return '';
    }

    return valueGenerator(String(value));
  }
}
