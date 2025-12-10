import { HttpStatus } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { ValidationException } from './validation.exception';

describe('ValidationException', () => {
  it('should create a ValidationException with message only', () => {
    const exception = new ValidationException('Validation failed');

    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);

    const response = exception.getResponse() as any;
    expect(response.message).toBe('Validation failed');
    expect(response.errorCode).toBe('VALIDATION_ERROR');
    expect(response.details).toBeUndefined();
    expect(response.timestamp).toBeDefined();
  });

  it('should create a ValidationException with message and details', () => {
    const exception = new ValidationException('Validation failed', { field: 'email', reason: 'invalid format' });

    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);

    const response = exception.getResponse() as any;
    expect(response.message).toBe('Validation failed');
    expect(response.errorCode).toBe('VALIDATION_ERROR');
    expect(response.details).toEqual({ field: 'email', reason: 'invalid format' });
    expect(response.timestamp).toBeDefined();
  });
});
