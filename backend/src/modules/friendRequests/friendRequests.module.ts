import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { FriendRequestsController } from './friendRequests.controller';
import { FriendRequestsService } from './friendRequests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import {
  FriendRequest,
  FriendRequestSchema,
} from '../../schemas/friendRequest.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
  ],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
  exports: [FriendRequestsModule],
})
export class FriendRequestsModule {}
