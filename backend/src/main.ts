import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { ResponseInterceptor } from './interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors({
    origin: '*',
  });

  /**
   * Swagger configuration
   */
  const config = new DocumentBuilder()
    .setTitle('OmniaDarts')
    .setDescription('The OmniaDarts API description')
    .addTag('users')
    .addTag('auth')
    .addTag('friends')
    .addTag('clubs')
    .addTag('posts')
    .addTag('tournaments')
    .addTag('chat')
    .addTag('tournament-matches')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get<ConfigService>(ConfigService);
  await app.listen(configService.get('SERVICE_PORT'));
}

bootstrap();
