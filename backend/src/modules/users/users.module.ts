import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from '../../schemas/club.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Club.name, schema: ClubSchema }
  ]
  )],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
