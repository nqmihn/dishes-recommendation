import { ErrorCode } from './error-code';
import { ErrorException } from './error-exception';

export class TooManyRequestException extends ErrorException {
  constructor(code: ErrorCode, message: string | undefined) {
    super(code, message, undefined);
  }

  public getErrors(): Record<string, any> {
    return {
      error_code: this.code,
      error_message: this.message,
      ...(this.description && { error_description: this.description }),
    };
  }
}
