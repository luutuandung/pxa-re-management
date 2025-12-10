import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { BaseException } from '../exceptions/base.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, errorResponse } = this.buildErrorResponse(exception, request);

    // ログ出力
    this.logger.error(
      `${request.method} ${request.url} - ${statusCode} - ${errorResponse.message}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception)
    );

    response.status(statusCode).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    request: Request
  ): {
    statusCode: number;
    errorResponse: any;
  } {
    if (exception instanceof BaseException) {
      // カスタムエラークラスの場合
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      const errorResponse = {
        statusCode,
        timestamp: exceptionResponse.timestamp,
        path: request.url,
        method: request.method,
        message: exceptionResponse.message,
        errorCode: exceptionResponse.errorCode,
        details: exceptionResponse.details,
      };

      return { statusCode, errorResponse };
    }

    if (exception instanceof HttpException) {
      // その他のHttpExceptionの場合
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const errorResponse = {
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || 'Http exception',
        errorCode: 'HTTP_EXCEPTION',
        details: typeof exceptionResponse === 'object' ? exceptionResponse : undefined,
      };

      return { statusCode, errorResponse };
    }

    // 予期しないエラーの場合
    this.logger.error(`Unexpected error: ${(exception as Error).message}`, (exception as Error).stack);

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 'Internal server error',
      errorCode: 'INTERNAL_SERVER_ERROR',
    };

    return { statusCode, errorResponse };
  }
}
