import { HttpStatus } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { NotFoundException } from './not-found.exception';

describe('NotFoundException', () => {
  it('should create a NotFoundException with resource only', () => {
    const exception = new NotFoundException('User');

    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);

    const response = exception.getResponse() as any;
    expect(response.message).toBe('User not found');
    expect(response.errorCode).toBe('NOT_FOUND');
    expect(response.details).toEqual({ resource: 'User', identifier: undefined });
    expect(response.timestamp).toBeDefined();
  });

  it('should create a NotFoundException with resource and identifier', () => {
    const exception = new NotFoundException('User', 123);

    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);

    const response = exception.getResponse() as any;
    expect(response.message).toBe('User with identifier 123 not found');
    expect(response.errorCode).toBe('NOT_FOUND');
    expect(response.details).toEqual({ resource: 'User', identifier: 123 });
    expect(response.timestamp).toBeDefined();
  });

  it('should create a NotFoundException with string identifier', () => {
    const exception = new NotFoundException('Product', 'ABC123');

    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);

    const response = exception.getResponse() as any;
    expect(response.message).toBe('Product with identifier ABC123 not found');
    expect(response.errorCode).toBe('NOT_FOUND');
    expect(response.details).toEqual({ resource: 'Product', identifier: 'ABC123' });
    expect(response.timestamp).toBeDefined();
  });
});
