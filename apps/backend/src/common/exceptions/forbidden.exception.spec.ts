import { HttpStatus } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { ForbiddenException } from './forbidden.exception';

describe('ForbiddenException', () => {
  it('should create a ForbiddenException with default message', () => {
    const exception = new ForbiddenException();

    expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);

    const response = exception.getResponse() as any;
    expect(response.message).toBe('Access forbidden');
    expect(response.errorCode).toBe('FORBIDDEN');
    expect(response.details).toBeUndefined();
    expect(response.timestamp).toBeDefined();
  });

  it('should create a ForbiddenException with custom message', () => {
    const exception = new ForbiddenException('Custom forbidden message');

    expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);

    const response = exception.getResponse() as any;
    expect(response.message).toBe('Custom forbidden message');
    expect(response.errorCode).toBe('FORBIDDEN');
    expect(response.details).toBeUndefined();
    expect(response.timestamp).toBeDefined();
  });
});
