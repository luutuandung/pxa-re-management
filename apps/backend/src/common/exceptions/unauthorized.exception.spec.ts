import { HttpStatus } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { UnauthorizedException } from './unauthorized.exception';

describe('UnauthorizedException', () => {
  it('should create an UnauthorizedException with default message', () => {
    const exception = new UnauthorizedException();

    expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);

    const response = exception.getResponse() as any;
    expect(response.message).toBe('Unauthorized access');
    expect(response.errorCode).toBe('UNAUTHORIZED');
    expect(response.details).toBeUndefined();
    expect(response.timestamp).toBeDefined();
  });

  it('should create an UnauthorizedException with custom message', () => {
    const exception = new UnauthorizedException('Custom unauthorized message');

    expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);

    const response = exception.getResponse() as any;
    expect(response.message).toBe('Custom unauthorized message');
    expect(response.errorCode).toBe('UNAUTHORIZED');
    expect(response.details).toBeUndefined();
    expect(response.timestamp).toBeDefined();
  });
});
