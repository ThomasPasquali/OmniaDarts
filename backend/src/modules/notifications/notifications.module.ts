import { Module } from "@nestjs/common";
import { NotificationsGateway } from './notifications.gateway';
import {EventsModule} from "../events/events.module";
import {UsersModule} from "../users/users.module";
import {AuthModule} from "../auth/auth.module";
import {ClubsModule} from "../clubs/clubs.module";
import {ChatsModule} from "../chat/chats.module";

@Module({
  imports: [EventsModule, UsersModule, AuthModule, ClubsModule, ChatsModule],
  providers: [NotificationsGateway]
})
export class NotificationsModule {}