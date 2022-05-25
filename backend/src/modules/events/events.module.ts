import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ClubsModule } from '../clubs/clubs.module';
import { ChatsModule } from '../chats/chats.module';
import { FriendRequestsModule } from '../friendRequests/friendRequests.module';
import { ChatsGateway } from './chats.gateway';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ClubsModule,
    ChatsModule,
    FriendRequestsModule,
  ],
  providers: [EventsGateway, ChatsGateway],
  exports: [EventsGateway, ChatsGateway],
})
export class EventsModule {}
