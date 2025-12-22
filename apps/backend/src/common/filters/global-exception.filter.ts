import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { join, extname, dirname, normalize, resolve } from 'path';
import { existsSync } from 'fs';
import { BaseException } from '../exceptions/base.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // SPAフォールバック: 404エラーで/docsルートでない場合、静的ファイルまたはindex.htmlを返す
    if (exception instanceof NotFoundException && !request.path.startsWith('/docs')) {
      const publicPath = this.getPublicFolderPath();
      if (publicPath) {
        const filePath = GlobalExceptionFilter.resolveExistingFilePath(request.path, publicPath);
        return response.sendFile(filePath);
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

  /**
   * publicフォルダのパスを取得する
   * 開発環境ではapps/frontend/dist、本番環境ではwebapps/publicを確認
   * 
   * @returns publicフォルダの絶対パス、見つからない場合はnull
   */
  private getPublicFolderPath(): string | null {
    let currentDir = normalize(resolve(__dirname));
    const visitedDirs = new Set<string>();
    
    while (true) {
      // 循環参照の防止
      if (visitedDirs.has(currentDir)) {
        break;
      }
      visitedDirs.add(currentDir);
      
      // 本番環境: webapps/public を優先的に確認
      const productionPublicPath = resolve(currentDir, 'webapps', 'public');
      if (existsSync(productionPublicPath)) {
        return productionPublicPath;
      }
      
      // 開発環境: apps/frontend/dist を確認
      const developmentPublicPath = resolve(currentDir, 'apps', 'frontend', 'dist');
      if (existsSync(developmentPublicPath)) {
        return developmentPublicPath;
      }
      
      // 親ディレクトリに移動
      const parentDir = dirname(currentDir);
      if (parentDir === currentDir) {
        // ファイルシステムのルートに到達
        break;
      }
      currentDir = parentDir;
    }
    
    // Public folderが見つからない場合のみログ出力（デバッグ用）
    this.logger.warn(`Public folder not found. Searched from: ${__dirname}`);
    return null;
  }

  /**
   * リクエストパスに基づいて返すべきファイルパスを解決する
   * アルゴリズム:
   * 1. パスが明示的に「index.html」になっている場合、index.htmlファイルを返す
   * 2. ファイル名拡張子が明示的に指定されていて、対象ファイルが存在している場合、publicフォルダから該当ファイルを返す
   * 3. 上記の条件がどちらも満たされていない場合、またはファイルが見つからなかった場合、index.htmlファイルを返す
   */
  private static resolveExistingFilePath(requestPath: string, publicPath: string): string {
    const indexPath = join(publicPath, 'index.html');
    
    // パスが明示的に「index.html」になっている場合
    if (requestPath.toLowerCase().endsWith('/index.html') || requestPath.toLowerCase() === 'index.html') {
      return indexPath;
    }
    
    // ファイル名拡張子が明示的に指定されている場合
    const fileExtension = extname(requestPath);
    if (fileExtension) {
      // 拡張子がある場合、publicフォルダから該当ファイルを探す
      // リクエストパスから先頭のスラッシュを除去
      const relativePath = requestPath.startsWith('/') ? requestPath.slice(1) : requestPath;
      const targetFilePath = join(publicPath, relativePath);
      
      if (existsSync(targetFilePath)) {
        return targetFilePath;
      }
    }
    
    // 上記の条件がどちらも満たされていない場合、index.htmlファイルを返す
    return indexPath;
  }
}
