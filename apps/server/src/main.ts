import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { swaggerBoot } from './swagger/swaggerBoot';
import cookieParser from "cookie-parser";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  swaggerBoot(app);
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://13.125.224.11:3000','https://moonjin-service.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
  });

  await app.listen(Number(process.env.SERVER_PORT));
}

bootstrap();
