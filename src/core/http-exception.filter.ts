import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Duplicate key (MongoDB)
    if (exception?.code === 11000) {
      const field = Object.keys(exception.keyValue)[0];
      const value = exception.keyValue[field];
      return response.status(400).json({
        statusCode: 400,
        message: `${value} is available`,
        data: null,
      });
    }

    // Validation hoặc các lỗi HTTP khác
          const res = exception instanceof HttpException
        ? exception.getResponse()
        : 'Lỗi không xác định';

      const message =
        typeof res === 'string'
          ? res
          : (res as any).message || 'Lỗi xảy ra';

      return response.status(status).json({
        statusCode: status,
        message,
        data: null,
      });
  }
}
