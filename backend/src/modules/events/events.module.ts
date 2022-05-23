import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import {AuthModule} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";
import {ClubsModule} from "../clubs/clubs.module";

@Module({
  imports: [AuthModule, UsersModule, ClubsModule],
  providers: [EventsGateway, EventsService],
  exports: [EventsGateway, EventsService]
})
export class EventsModule {}
