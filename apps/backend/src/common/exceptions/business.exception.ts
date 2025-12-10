import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class BusinessException extends BaseException {
  constructor(message: string, errorCode?: string, details?: any, cause?: Error) {
    super(message, HttpStatus.BAD_REQUEST, errorCode, details, cause);
  }
}
