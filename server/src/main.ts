import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { getLogLevels } from './common/logging/get-log-levels';
import { createValidationPipe } from './common/validation/create-validation-pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(),
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  // Enable CORS
  app.enableCors({
    origin: '*', // Adjust this as needed
  });

  app.useGlobalFilters(new ApiExceptionFilter());
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalPipes(createValidationPipe());

  // Swagger / OpenAPI docs (UI at /docs, raw spec at /docs-json)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nuxt3 NestJS MongoDB Starter API')
    .setDescription('API documentation for the starter backend')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  console.log(`NestJS is running on: ${await app.getUrl()}`);
}
bootstrap();
