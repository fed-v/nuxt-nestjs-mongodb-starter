import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  private readonly excludedPaths: string[];

  constructor(private readonly configService: ConfigService) {
    this.excludedPaths = this.configService
      .get<string>('REQUEST_LOG_EXCLUDE', '/health')
      .split(',')
      .map((excludedPath) => excludedPath.trim())
      .map((excludedPath) => this.normalizePath(excludedPath))
      .filter(Boolean);
  }

  use(request: Request, response: Response, next: NextFunction) {
    if (!this.isEnabled() || this.shouldSkip(request.originalUrl)) {
      next();
      return;
    }

    const startedAt = Date.now();
    const requestId = this.getRequestId(request);

    response.setHeader('x-request-id', requestId);

    response.on('finish', () => {
      const duration = Date.now() - startedAt;
      const log = {
        requestId,
        method: request.method,
        path: request.originalUrl,
        statusCode: response.statusCode,
        durationMs: duration,
      };

      const message = JSON.stringify(log);

      if (response.statusCode >= 500) {
        this.logger.error(message);
        return;
      }

      if (response.statusCode >= 400) {
        this.logger.warn(message);
        return;
      }

      this.logger.log(message);
    });

    next();
  }

  private isEnabled(): boolean {
    return (
      this.configService.get<string>('REQUEST_LOGGING_ENABLED', 'true') !==
      'false'
    );
  }

  private shouldSkip(url: string): boolean {
    const normalizedUrl = this.normalizePath(url);

    return this.excludedPaths.some((excludedPath) =>
      normalizedUrl.startsWith(excludedPath),
    );
  }

  private normalizePath(path: string): string {
    const withoutQueryString = path.split('?')[0] ?? '';

    if (!withoutQueryString || withoutQueryString === '/') {
      return '/';
    }

    return withoutQueryString.replace(/\/+$/, '');
  }

  private getRequestId(request: Request): string {
    const requestId = request.headers['x-request-id'];

    if (Array.isArray(requestId)) {
      return requestId[0] ?? randomUUID();
    }

    return requestId ?? randomUUID();
  }
}
