import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FriendRequest,
  FriendRequestSchema,
} from '../../schemas/friendRequest.schema';
import { UsersModule } from '../users/users.module';
import { FriendRequestsController } from './friendRequests.controller';
import { FriendRequestsService } from './friendRequests.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
  ],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
  exports: [FriendRequestsService],
})
export class FriendRequestsModule {}
