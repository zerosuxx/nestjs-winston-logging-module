import { Inject } from '@nestjs/common';
import { AppLoggerProviderRegister } from '../register/app-logger-provider.register';

export function InjectAppLogger(scope: string): ParameterDecorator {
  return Inject(AppLoggerProviderRegister.register(scope));
}
