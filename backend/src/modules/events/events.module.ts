import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import {AuthModule} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";
import {ClubsModule} from "../clubs/clubs.module";
import {ChatsModule} from "../chat/chats.module";

@Module({
  imports: [AuthModule, UsersModule, ClubsModule, ChatsModule],
  providers: [EventsGateway],
  exports: [EventsGateway]
})
export class EventsModule {}
