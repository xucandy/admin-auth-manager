import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm/error/TypeORMError';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let message = '';
    if (exception instanceof TypeORMError) {
      message = exception.message;
    } else {
      message = 'internal server error';
    }
    Logger.error(`url:${request.url}, method: ${request.method} `);
    Logger.error(exception.stack);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      code: status,
      message: message,
    });
  }
}
