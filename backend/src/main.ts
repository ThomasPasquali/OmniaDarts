import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { NestFactoryStatic } from '@nestjs/core/nest-factory';

async function bootstrap() {
  const apiFactory = new NestFactoryStatic();
  const app = await apiFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });

  app.setGlobalPrefix('/api/v1/');

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
      .setBasePath('v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get<ConfigService>(ConfigService);
  await app.listen(configService.get('PORT'));
}

bootstrap();
