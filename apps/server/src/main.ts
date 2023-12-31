import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { swaggerBoot } from './swagger/swaggerBoot';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerBoot(app);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(Number(process.env.SERVER_PORT));
}

bootstrap();
