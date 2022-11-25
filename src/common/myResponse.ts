import { ApiProperty } from '@nestjs/swagger';

export class MyResponse<T = any> {
  @ApiProperty({
    description: '响应状态码 200 成功',
  })
  code: number;
  @ApiProperty({
    description: '响应消息 成功',
  })
  message: string;
  @ApiProperty({
    description: '响应 结果',
    required: false,
  })
  data?: T;
  @ApiProperty({
    description: '错误堆栈',
    required: false,
  })
  error?: string;
  constructor(code: number, message: string, data?: T, error?: string) {
    this.code = code;
    this.message = message;
    this.data ??= data;
    this.error ??= error;
  }
  static success(): MyResponse<any>;
  static success(message: string): MyResponse<any>;
  static success<T>(data: T): MyResponse<T>;
  static success<T>(message: string, data: T): MyResponse<T>;
  static success<T>(m?: any, data?: T): MyResponse<T> {
    if (!m && !data) {
      return new MyResponse<T>(200, 'ok', data);
    }
    if (arguments.length === 1) {
      if (typeof m === 'string') {
        return new MyResponse<T>(200, m);
      } else {
        return new MyResponse<T>(200, 'ok', m);
      }
    } else {
      return new MyResponse<T>(200, m, data);
    }
  }
  static badRequest(message = 'bad request'): MyResponse {
    return new MyResponse(400, message);
  }
  static fail(): MyResponse<any>;
  static fail(message: string): MyResponse<any>;
  static fail(error: Error): MyResponse<any>;
  static fail(message: string, error: Error): MyResponse<any>;
  static fail(message?: any, error?: Error) {
    if (arguments.length === 0) {
      return new MyResponse(500, 'fail', undefined, undefined);
    }
    if (arguments.length === 1) {
      if (typeof message === 'string') {
        return new MyResponse(500, message);
      } else {
        return new MyResponse(500, 'fail', error.message);
      }
    }
    return new MyResponse(500, 'fail', message, error.message);
  }
}
