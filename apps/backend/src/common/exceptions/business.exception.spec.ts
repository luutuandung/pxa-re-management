import { HttpStatus } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { BusinessException } from './business.exception';

describe('BusinessException', () => {
  it('should create a BusinessException with default values', () => {
    const exception = new BusinessException('Business error');

    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);

    const response = exception.getResponse() as any;
    expect(response.message).toBe('Business error');
    expect(response.errorCode).toBeUndefined();
    expect(response.details).toBeUndefined();
    expect(response.timestamp).toBeDefined();
  });

  it('should create a BusinessException with custom values', () => {
    const exception = new BusinessException('Custom business error', 'BUSINESS_ERROR', { code: 'B001' });

    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);

    const response = exception.getResponse() as any;
    expect(response.message).toBe('Custom business error');
    expect(response.errorCode).toBe('BUSINESS_ERROR');
    expect(response.details).toEqual({ code: 'B001' });
    expect(response.timestamp).toBeDefined();
  });
});
