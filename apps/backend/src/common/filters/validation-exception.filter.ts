import { type ArgumentsHost, BadRequestException, Catch, type ExceptionFilter, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    // バリデーションエラーの詳細情報を整理
    const validationErrors = this.formatValidationErrors(exceptionResponse);

    const errorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 'Validation failed',
      errorCode: 'VALIDATION_ERROR',
      details: validationErrors,
    };

    this.logger.warn(`Validation error: ${request.method} ${request.url}`, JSON.stringify(validationErrors));

    response.status(statusCode).json(errorResponse);
  }

  private formatValidationErrors(exceptionResponse: any): any {
    // class-validatorのエラーフォーマットを整理
    if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
      return exceptionResponse.message.map((error: any) => ({
        property: error.property,
        value: error.value,
        constraints: error.constraints,
      }));
    }

    return exceptionResponse;
  }
}
