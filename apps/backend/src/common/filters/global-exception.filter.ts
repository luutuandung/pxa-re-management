import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { BaseException } from '../exceptions/base.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // SPAフォールバック: 404エラーでAPIルートでない場合、index.htmlを返す
    if (exception instanceof NotFoundException && !request.path.startsWith('/api') && !request.path.startsWith('/docs')) {
      const frontendDistPath = join(__dirname, '../../../frontend/dist');
      const indexPath = join(frontendDistPath, 'index.html');
      
      // 静的ファイルのリクエストかどうかをチェック
      const staticFileExtensions = ['.js', '.css', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.map'];
      const hasStaticFileExtension = staticFileExtensions.some(ext => request.path.toLowerCase().endsWith(ext));
      
      // 静的ファイルでなく、frontend distが存在する場合、index.htmlを返す
      if (!hasStaticFileExtension && existsSync(indexPath)) {
        return response.sendFile(indexPath);
      }
    }

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
