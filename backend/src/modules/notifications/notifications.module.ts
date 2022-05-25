import { Module } from "@nestjs/common";
import { NotificationsGateway } from './notifications.gateway';
import {EventsModule} from "../events/events.module";
import {UsersModule} from "../users/users.module";
import {AuthModule} from "../auth/auth.module";
import {ClubsModule} from "../clubs/clubs.module";
import {ChatModule} from "../chat/chat.module";
import {MatchesModule} from "../matches/matches.module";

@Module({
  imports: [EventsModule, UsersModule, AuthModule, ClubsModule, ChatModule, MatchesModule],
  providers: [NotificationsGateway]
})
export class NotificationsModule {}