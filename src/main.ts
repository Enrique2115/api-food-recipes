/* eslint-disable @typescript-eslint/no-namespace */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import multipart from 'fastify-multipart';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { API, envs, swaggerConfig } from './config';
import { LoggerInterceptor } from './infra/logger/logger.interceptor';
import { ErrorResponseNormalizerFilter } from './infra/response-normalizer/error-response.filter';
import { SuccessResponseNormalizerInterceptor } from './infra/response-normalizer/success-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  app.useLogger(app.get(Logger));
  app.setGlobalPrefix(API);

  app.useGlobalFilters(app.get(ErrorResponseNormalizerFilter));
  app.useGlobalInterceptors(
    app.get(LoggerInterceptor),
    app.get(SuccessResponseNormalizerInterceptor),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5mb
      files: 1, // 1 file max
    },
  });

  // Swagger Config
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(envs.PORT, envs.HOST);
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  // eslint-disable-next-line no-console
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

process.on('uncaughtException', handleError);

declare global {
  namespace Storage {
    interface MultipartFile {
      toBuffer: () => Promise<Buffer>;
      file: NodeJS.ReadableStream;
      filepath: string;
      fieldname: string;
      filename: string;
      encoding: string;
      mimetype: string;
      fields: import('fastify-multipart').MultipartFields;
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    incomingFile: Storage.MultipartFile;
  }
}
