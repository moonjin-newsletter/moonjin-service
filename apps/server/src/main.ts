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
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
  });

  await app.listen(Number(process.env.SERVER_PORT));
}

bootstrap();
