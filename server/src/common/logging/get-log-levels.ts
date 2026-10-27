import { LogLevel } from '@nestjs/common';

const logLevels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];

export function getLogLevels(logLevel = process.env.LOG_LEVEL): LogLevel[] {
  switch (logLevel) {
    case 'error':
      return ['error'];
    case 'warn':
      return ['error', 'warn'];
    case 'log':
      return ['error', 'warn', 'log'];
    case 'debug':
      return ['error', 'warn', 'log', 'debug'];
    default:
      return logLevels;
  }
}
