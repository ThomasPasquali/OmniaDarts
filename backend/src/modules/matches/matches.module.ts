import {forwardRef, Module} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Match, MatchSchema} from "../../schemas/match.schema";
import {UsersModule} from "../users/users.module";
import {LobbiesService} from "./lobbies.service";
import {LobbiesGateway} from "./lobbies.gateway";
import {AuthModule} from "../auth/auth.module";
import {ClubsModule} from "../clubs/clubs.module";
import {ChatsModule} from "../chats/chats.module";

@Module({
  imports: [
    MatchesModule,
    UsersModule,
    AuthModule,
    forwardRef(() => ClubsModule),
    forwardRef(() => ChatsModule),
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }])
  ],
  providers: [MatchesService, LobbiesService, LobbiesGateway],
  controllers: [MatchesController],
  exports: [MongooseModule, MatchesService],
})
export class MatchesModule {}
