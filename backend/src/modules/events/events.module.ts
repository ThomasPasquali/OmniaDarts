import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import {AuthModule} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [AuthModule, UsersModule],
  providers: [EventsGateway, EventsService],
  exports: [EventsGateway, EventsService]
})
export class EventsModule {}
