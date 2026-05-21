import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Request, Response } from 'express';
import { AppModule } from './app/app.module';

function resolveAdminDistPath() {
  const runtimeEntryPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
  const runtimeDir = runtimeEntryPath ? path.dirname(runtimeEntryPath) : null;
  const runtimeCandidates = runtimeDir
    ? [path.join(runtimeDir, 'admin'), path.resolve(runtimeDir, '..', 'admin'), path.resolve(runtimeDir, '..', '..', 'admin')]
    : [];

  for (const candidate of runtimeCandidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return path.join(process.cwd(), 'dist', 'admin', 'admin');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();
  const adminDistPath = resolveAdminDistPath();

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Devfolio Blog API')
    .setDescription('API documentation for devfolio-blog')
    .setVersion('1.0.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  if (existsSync(adminDistPath)) {
    expressApp.use('/admin', express.static(adminDistPath));
    expressApp.get(/^\/admin\/.*$/, (_request: Request, response: Response) => {
      response.sendFile(path.join(adminDistPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  Logger.log(`API docs ready at http://localhost:${port}/api/docs`, 'Bootstrap');
}

void bootstrap();
