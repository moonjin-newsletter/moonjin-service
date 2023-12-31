import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerBoot(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Moonjin Service')
    .setDescription('This is the API description')
    .setVersion('1.0')
    .addTag('Moonjin')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
