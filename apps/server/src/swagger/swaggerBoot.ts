import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from "fs";
import * as path from "path";

export function swaggerBoot(app: INestApplication<any>) {
  const swaagerConfig = readFileSync(path.join(__dirname, '../../../swagger.json'), 'utf8');
  SwaggerModule.setup('swagger', app, JSON.parse(swaagerConfig));
}
