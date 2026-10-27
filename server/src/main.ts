import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { getLogLevels } from './common/logging/get-log-levels';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(),
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  // CORS_ORIGIN is a comma-separated allowlist; unset allows every origin
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',').map((o) => o.trim()) : '*',
  });

  await app.listen(port);
  console.log(`NestJS is running on: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  console.error('NestJS failed to start:', error);
  process.exit(1);
});
