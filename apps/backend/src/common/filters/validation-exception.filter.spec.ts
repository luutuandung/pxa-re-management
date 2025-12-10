import { type ArgumentsHost, BadRequestException, Logger } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ValidationExceptionFilter } from './validation-exception.filter';

describe('ValidationExceptionFilter', () => {
  let filter: ValidationExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new ValidationExceptionFilter();

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    mockRequest = {
      method: 'POST',
      url: '/test',
    };

    mockHost = {
      switchToHttp: vi.fn().mockReturnValue({
        getResponse: vi.fn().mockReturnValue(mockResponse),
        getRequest: vi.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ArgumentsHost;

    vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle BadRequestException with validation errors', () => {
    const validationErrors = [
      {
        property: 'email',
        value: 'invalid-email',
        constraints: { isEmail: 'email must be a valid email' },
      },
      {
        property: 'name',
        value: '',
        constraints: { isNotEmpty: 'name should not be empty' },
      },
    ];

    const exception = new BadRequestException({
      message: validationErrors,
      error: 'Bad Request',
      statusCode: 400,
    });

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      timestamp: expect.any(String),
      path: '/test',
      method: 'POST',
      message: 'Validation failed',
      errorCode: 'VALIDATION_ERROR',
      details: [
        {
          property: 'email',
          value: 'invalid-email',
          constraints: { isEmail: 'email must be a valid email' },
        },
        {
          property: 'name',
          value: '',
          constraints: { isNotEmpty: 'name should not be empty' },
        },
      ],
    });
  });

  it('should handle BadRequestException without validation errors', () => {
    const exception = new BadRequestException('Simple bad request');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      timestamp: expect.any(String),
      path: '/test',
      method: 'POST',
      message: 'Validation failed',
      errorCode: 'VALIDATION_ERROR',
      details: {
        error: 'Bad Request',
        message: 'Simple bad request',
        statusCode: 400,
      },
    });
  });

  it('should handle BadRequestException with object response', () => {
    const exception = new BadRequestException({
      message: 'Custom error',
      code: 'CUSTOM_ERROR',
    });

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      timestamp: expect.any(String),
      path: '/test',
      method: 'POST',
      message: 'Validation failed',
      errorCode: 'VALIDATION_ERROR',
      details: {
        message: 'Custom error',
        code: 'CUSTOM_ERROR',
      },
    });
  });
});
