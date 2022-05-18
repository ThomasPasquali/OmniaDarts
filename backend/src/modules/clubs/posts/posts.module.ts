

import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { ClubsModule } from '../clubs.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {CaslModule} from "../../casl/casl.module";
import {UsersModule} from "../../users/users.module";

@Module({
  imports: [
    ClubsModule,
    UsersModule,
    CaslModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('FOLDER_POST_IMAGES'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PostsController],
})
export class PostsModule {}
