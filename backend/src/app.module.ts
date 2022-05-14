import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchThrows, MatchThrowsSchema } from './schemas/matchThrows.schema';
import { Throw, ThrowSchema } from './schemas/throw.schema';
import { Dart, DartSchema } from './schemas/dart.schema';
import { UsersModule } from './modules/users/users.module';
import { FriendsModule } from './modules/friends/friends.module';
import { ClubsModule } from './modules/clubs/clubs.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://jennifer69:petme@localhost:27017', {
      dbName: 'test',
    }),
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: MatchThrows.name, schema: MatchThrowsSchema },
      { name: Throw.name, schema: ThrowSchema },
      { name: Dart.name, schema: DartSchema },
    ]),
    UsersModule,
    FriendsModule,
    ClubsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
