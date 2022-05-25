import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import {AuthModule} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";
import {ClubsModule} from "../clubs/clubs.module";
import {ChatModule} from "../chat/chat.module";
import {MatchesModule} from "../matches/matches.module";

@Module({
  imports: [AuthModule, UsersModule, ClubsModule, ChatModule, MatchesModule],
  providers: [EventsGateway],
  exports: [EventsGateway]
})
export class EventsModule {}
