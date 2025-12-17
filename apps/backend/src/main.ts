import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Expressの機能を利用してpublic配下を静的ファイル公開フォルダに指定
  app.use(express.static(join(process.cwd(), '../public')));
  
  // バリデーションパイプの設定
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Swagger設定
  const config = new DocumentBuilder()
    .setTitle('PXA RE Management API')
    .setDescription('PXA RE Management システムのAPI仕様書')
    .setVersion('1.0')
    .addTag('general-cost', '統一原価項目関連API')
    .addTag('language', '言語マスター関連API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // CORS設定（必要に応じて）
  app.enableCors();

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3001}`);
  console.log(`Swagger docs available at: http://localhost:${process.env.PORT ?? 3001}/api/docs`);
}

bootstrap();
