import { HttpStatus } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { BaseException } from './base.exception';

describe('BaseException', () => {
  it('should create a BaseException with default values', () => {
    const exception = new BaseException('Test message');

    expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

    const response = exception.getResponse() as any;
    expect(response.message).toBe('Test message');
    expect(response.errorCode).toBeUndefined();
    expect(response.details).toBeUndefined();
    expect(response.timestamp).toBeDefined();
  });

  it('should create a BaseException with custom values', () => {
    const exception = new BaseException('Custom message', HttpStatus.BAD_REQUEST, 'CUSTOM_ERROR', { field: 'test' });

    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);

    const response = exception.getResponse() as any;
    expect(response.message).toBe('Custom message');
    expect(response.errorCode).toBe('CUSTOM_ERROR');
    expect(response.details).toEqual({ field: 'test' });
    expect(response.timestamp).toBeDefined();
  });
});
