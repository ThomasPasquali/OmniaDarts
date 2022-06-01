import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from '../../schemas/club.schema';
import { CaslModule } from '../casl/casl.module';
import { UsersModule } from '../users/users.module';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';
import { ChatsModule } from '../chats/chats.module';

@Module({
  imports: [
    ChatsModule,
    CaslModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Club.name, schema: ClubSchema }]),
  ],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [MongooseModule, ClubsService],
})
export class ClubsModule {}
