import {forwardRef, Module} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Match, MatchSchema} from "../../schemas/match.schema";
import {UsersModule} from "../users/users.module";
import {ChatModule} from "../chat/chat.module";
import {LobbiesService} from "./lobbies.service";
import {LobbiesGateway} from "./lobbies.gateway";
import {JwtService} from "@nestjs/jwt";
import {AuthModule} from "../auth/auth.module";
import {ClubsModule} from "../clubs/clubs.module";

@Module({
  imports: [
    forwardRef(() => ChatModule),
    UsersModule,
    AuthModule,
    forwardRef(() =>ClubsModule),
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }])
  ],
  providers: [MatchesService, LobbiesService, LobbiesGateway],
  controllers: [MatchesController],
  exports: [MongooseModule, MatchesService],
})
export class MatchesModule {}
