import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrorEnvelopeResponse,
} from '../../common/decorators/api-envelope-response.decorator';
import { HealthResponseDto } from './dto/health-response.dto';
import { HealthResponse, HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check API and database health' })
  @ApiEnvelopeResponse(HealthResponseDto)
  @ApiErrorEnvelopeResponse(HttpStatus.SERVICE_UNAVAILABLE, {
    description: 'The database connection is unavailable',
    code: 'HEALTH_CHECK_FAILED',
    message: 'Database connection is unavailable',
    details: { api: 'up', database: 'down' },
  })
  check(): HealthResponse {
    return this.healthService.check();
  }
}
