import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from '../../schemas/club.schema';
import { CaslModule } from '../casl/casl.module';
import { UsersModule } from '../users/users.module';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';
import { ChatModule } from '../chat/chat.module';
import {MatchesModule} from "../matches/matches.module";

@Module({
  imports: [
    ChatModule,
    CaslModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Club.name, schema: ClubSchema }]),
  ],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [MongooseModule, ClubsService],
})
export class ClubsModule {}
