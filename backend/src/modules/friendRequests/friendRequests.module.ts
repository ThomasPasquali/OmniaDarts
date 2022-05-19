import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { FriendRequestsController } from './friendRequests.controller';
import { FriendRequestsService } from './friendRequests.service';

@Module({
  imports: [UsersModule],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
  exports: [FriendRequestsModule],
})
export class FriendRequestsModule {}
