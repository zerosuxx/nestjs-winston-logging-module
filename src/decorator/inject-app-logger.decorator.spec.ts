import { AppLoggerProviderRegister } from '../register/app-logger-provider.register';
import { InjectAppLogger } from './inject-app-logger.decorator';

const originalRegister = AppLoggerProviderRegister.register;

describe('InjectAppLogger', () => {
  let registerMock: jest.Mock;

  beforeEach(() => {
    registerMock = jest.fn();
    AppLoggerProviderRegister.register = registerMock;
  });

  afterEach(() => {
    AppLoggerProviderRegister.register = originalRegister;
  });

  it('should calls with valid parameter the scope registered and returns parameter decorator', () => {
    const scope = 'example-scope';
    const result = InjectAppLogger(scope);
    expect(registerMock).toHaveBeenCalledWith(scope);

    expect(result).not.toBeNull();
  });
});
