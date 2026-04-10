import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ErrorException } from './error-exception';
import { ErrorCode } from './error-code';
import { TypeORMError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);

    let errorException: ErrorException;
    let httpStatusCode: number;

    if (exception instanceof ErrorException) {
      errorException = exception;
      httpStatusCode = exception.httpStatusCode;
    } else if (exception instanceof TypeORMError) {
      errorException = new ErrorException(ErrorCode.DATABASE_ERROR, 'Something went wrong', 'Something went wrong');
      httpStatusCode = errorException.httpStatusCode;
    } else {
      errorException = new ErrorException(
        ErrorCode.UNDEFINED_ERROR,
        exception.response?.error ?? exception.response?.message ?? exception.message ?? 'Something went wrong',
        exception.message,
      );
      httpStatusCode = exception.status ?? errorException.httpStatusCode;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    try {
      response.setHeader('X-Error-Message', errorException.message);
    } catch (exception: any) {
      console.log(exception);
      response.setHeader('X-Error-Message', 'Undefined Error');
    }

    return response
      .setHeader('X-Error-Code', errorException.code)
      .status(httpStatusCode)
      .json(errorException.getErrors());
  }
}
