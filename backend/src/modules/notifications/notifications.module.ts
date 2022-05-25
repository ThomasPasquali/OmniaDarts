import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ClubsModule } from '../clubs/clubs.module';
import { ChatsModule } from '../chats/chats.module';
import { FriendRequestsModule } from '../friendRequests/friendRequests.module';

@Module({
  imports: [
    EventsModule,
    UsersModule,
    AuthModule,
    ClubsModule,
    ChatsModule,
    FriendRequestsModule,
  ],
  providers: [NotificationsGateway],
})
export class NotificationsModule {}
