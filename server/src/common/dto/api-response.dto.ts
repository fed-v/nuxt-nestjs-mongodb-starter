import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Swagger-only description of the success envelope added by
 * ApiResponseInterceptor. The `data` field is filled in per endpoint by the
 * @ApiEnvelopeResponse decorator.
 */
export class ApiSuccessResponseDto {
  @ApiProperty({ type: Boolean, example: true })
  success: true;

  @ApiProperty({ type: String, example: '2026-10-27T12:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ type: String, example: '/users' })
  path: string;
}

/** The `error` object inside the error envelope built by ApiExceptionFilter. */
export class ApiErrorBodyDto {
  @ApiProperty({
    type: String,
    example: 'NOT_FOUND',
    description: 'Machine-readable error code',
  })
  code: string;

  @ApiProperty({ type: String, example: 'Not found' })
  message: string;

  @ApiPropertyOptional({
    type: Object,
    description: 'Extra context. Its shape depends on the error.',
  })
  details?: unknown;
}

/**
 * Swagger-only description of the error envelope produced by
 * ApiExceptionFilter for every failed request.
 */
export class ApiErrorResponseDto {
  @ApiProperty({ type: Boolean, example: false })
  success: false;

  @ApiProperty({ type: ApiErrorBodyDto })
  error: ApiErrorBodyDto;

  @ApiProperty({ type: String, example: '2026-10-27T12:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ type: String, example: '/users' })
  path: string;
}
