import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { swaggerBoot } from './swagger/swaggerBoot';
import cookieParser from "cookie-parser";
import console from "console";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  swaggerBoot(app);
  app.use(cookieParser());

  app.enableCors({
    origin: [process.env.CLIENT_URL + '', process.env.CLIENT_DEV_URL + ''],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
  });
  console.log('Server is running... enableCors On : ',process.env.CLIENT_URL);

  await app.listen(Number(process.env.SERVER_PORT));
}

bootstrap();
