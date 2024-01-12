import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as process from "process";

describe('AppController Test (e2e)', () => {
  // const host= 'http://localhost:8080'
  let app: INestApplication;
  let testingModule : TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    await (await app.init()).listen(Number(process.env.SERVER_PORT));
  });

  afterAll(async () => {
    await app.close();
  });

  describe("API AUTH TEST", () => {
    it('/auth (POST)', async () => {
    });
  })

});
