import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { CaslModule } from './modules/casl/casl.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { PostsModule } from './modules/clubs/posts/posts.module';
import { FriendRequestsModule } from './modules/friendRequests/friendRequests.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { UsersModule } from './modules/users/users.module';
import { Dart, DartSchema } from './schemas/dart.schema';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchThrows, MatchThrowsSchema } from './schemas/matchThrows.schema';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatsModule } from './modules/chats/chats.module';
import { EventsModule } from './modules/events/events.module';
import { MatchesModule } from './modules/matches/matches.module';
import { TournamentMatchesModule } from './modules/tournament-matches/tournament-matches.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV == 'production',
      envFilePath: 'dev.env',
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get<string>('DATABASE_CONN')}`,
        dbName: `${configService.get<string>('DATABASE_NAME')}`,
        autoIndex: false,
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: MatchThrows.name, schema: MatchThrowsSchema },
      { name: Dart.name, schema: DartSchema },
    ]),
    UsersModule,
    FriendRequestsModule,
    TournamentsModule,
    ClubsModule,
    CaslModule,
    AuthModule,
    ChatsModule,
    NotificationsModule,
    PostsModule,
    EventsModule,
    MatchesModule,
    TournamentMatchesModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppModule {}
