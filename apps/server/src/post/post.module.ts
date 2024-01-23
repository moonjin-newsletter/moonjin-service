import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {UtilModule} from "../util/util.module";

@Module({
  imports: [
      PrismaModule,
      UtilModule
  ],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
