import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const res: any = exception.getResponse();
    if (res && res instanceof Object) {
      Logger.error(res);
    }
    Logger.error(exception.stack);
    response.json({
      code: status,
      message:
        typeof res === 'string'
          ? res
          : res.message instanceof Array
          ? res.message.join(';\n  ')
          : res.message,
    });
  }
}
