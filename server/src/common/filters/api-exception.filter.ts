import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

type ExceptionResponse = {
  code?: string;
  message?: string | string[];
  error?: string;
  details?: unknown;
};

const STATUS_ERRORS: Record<number, { code: string; message: string }> = {
  [HttpStatus.BAD_REQUEST]: { code: 'BAD_REQUEST', message: 'Bad request' },
  [HttpStatus.UNAUTHORIZED]: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
  [HttpStatus.FORBIDDEN]: { code: 'FORBIDDEN', message: 'Forbidden' },
  [HttpStatus.NOT_FOUND]: { code: 'NOT_FOUND', message: 'Not found' },
  [HttpStatus.CONFLICT]: { code: 'CONFLICT', message: 'Conflict' },
  [HttpStatus.UNPROCESSABLE_ENTITY]: {
    code: 'UNPROCESSABLE_ENTITY',
    message: 'Unprocessable entity',
  },
  [HttpStatus.TOO_MANY_REQUESTS]: {
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many requests',
  },
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = this.getExceptionResponse(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ApiErrorResponse = {
      success: false,
      error: {
        code: exceptionResponse.code ?? this.getErrorCode(status),
        message: this.getErrorMessage(status, exceptionResponse),
        details: exceptionResponse.details,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(body);
  }

  private getExceptionResponse(exception: unknown): ExceptionResponse {
    if (!(exception instanceof HttpException)) {
      return {
        message: 'Internal server error',
      };
    }

    const response = exception.getResponse();

    if (typeof response === 'string') {
      return {
        message: response,
      };
    }

    return response as ExceptionResponse;
  }

  private getErrorMessage(
    status: number,
    exceptionResponse: ExceptionResponse,
  ): string {
    if (Array.isArray(exceptionResponse.message)) {
      return exceptionResponse.message.join(', ');
    }

    if (exceptionResponse.message) {
      return exceptionResponse.message;
    }

    return exceptionResponse.error ?? this.getDefaultMessage(status);
  }

  private getErrorCode(status: number): string {
    return (
      STATUS_ERRORS[status]?.code ??
      (status >= HttpStatus.INTERNAL_SERVER_ERROR
        ? 'INTERNAL_ERROR'
        : 'API_ERROR')
    );
  }

  private getDefaultMessage(status: number): string {
    return (
      STATUS_ERRORS[status]?.message ??
      (status >= HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal server error'
        : 'Request failed')
    );
  }
}
