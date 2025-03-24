import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import {MicroserviceOptions, Transport} from '@nestjs/microservices'
import { ENV } from './config/env';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport: Transport.TCP,
    options: {
      port: ENV.PORT
    }
  });
  const logger = new Logger('Main')

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))

  logger.log(`Products microservice running on port ${ENV.PORT}`)
}
bootstrap();
