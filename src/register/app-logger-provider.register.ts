import { FactoryProvider } from '@nestjs/common';
import { LogManager } from '../manager/log.manager';
import { randomUUID } from 'crypto';

export class AppLoggerProviderRegister {
  private static providers: FactoryProvider[] = [];

  public static register(scope: string) {
    const providerName = this.generateProviderName(scope);

    this.providers.push({
      provide: providerName,
      inject: [LogManager],
      useFactory: (logManager: LogManager) => logManager.createAppLogger(scope),
    });

    return providerName;
  }

  public static getProviders() {
    return this.providers;
  }

  private static generateProviderName(scope: string) {
    return `logging-module-logger-${scope}-${randomUUID()}`.toLowerCase();
  }
}
