import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Match, MatchSchema} from "../../schemas/match.schema";
import {UsersModule} from "../users/users.module";
import {ChatModule} from "../chat/chat.module";
import {LobbyGateway} from "./lobbies.gateway";

@Module({
  imports: [
    ChatModule,
    MatchesModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }])
  ],
  providers: [MatchesService, LobbyGateway],
  controllers: [MatchesController],
  exports: [MongooseModule],
})
export class MatchesModule {}
