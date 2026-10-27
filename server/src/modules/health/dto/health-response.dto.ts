import { ApiProperty } from '@nestjs/swagger';

/**
 * Swagger-only descriptions of the HealthResponse type returned by
 * HealthService. Types disappear at runtime, so Swagger needs classes.
 */
export class HealthCheckDto {
  @ApiProperty({ type: String, enum: ['up', 'down'], example: 'up' })
  status: 'up' | 'down';
}

export class HealthChecksDto {
  @ApiProperty({ type: HealthCheckDto })
  api: HealthCheckDto;

  @ApiProperty({ type: HealthCheckDto })
  database: HealthCheckDto;
}

export class HealthResponseDto {
  @ApiProperty({ type: String, enum: ['ok'], example: 'ok' })
  status: 'ok';

  @ApiProperty({
    type: Number,
    example: 1234.56,
    description: 'Process uptime in seconds',
  })
  uptime: number;

  @ApiProperty({ type: HealthChecksDto })
  checks: HealthChecksDto;
}
