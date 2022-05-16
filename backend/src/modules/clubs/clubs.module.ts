import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { Club, ClubSchema } from '../../schemas/club.schema';
import { CaslModule } from '../casl/casl.module';
import { UsersModule } from '../users/users.module';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';

@Module({
  imports: [
    CaslModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Club.name, schema: ClubSchema },
      { name: User.name, schema: UserSchema }]),
  ],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [ClubsService]
})
export class ClubsModule {}
