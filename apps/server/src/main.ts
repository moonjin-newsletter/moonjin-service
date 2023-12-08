import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  swaggerBoot(app);

  await app.listen(Number(process.env.SERVER_PORT));
}
bootstrap();

function swaggerBoot(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Moonjin Service')
    .setDescription('This is the API description')
    .setVersion('1.0')
    .addTag('Moonjin')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
