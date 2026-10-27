import { ApiProperty } from '@nestjs/swagger';

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
