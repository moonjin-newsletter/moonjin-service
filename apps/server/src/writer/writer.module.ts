import { Module } from '@nestjs/common';
import { WriterController } from './writer.controller';
import { WriterService } from './writer.service';
import {UserModule} from "../user/user.module";
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports: [
      UserModule,
      PrismaModule
  ],
  controllers: [WriterController],
  providers: [WriterService],
  exports : [WriterService]
})
export class WriterModule {}
