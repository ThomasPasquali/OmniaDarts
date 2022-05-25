import {forwardRef, Module} from '@nestjs/common';
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
import { Throw, ThrowSchema } from './schemas/throw.schema';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatModule } from './modules/chat/chat.module';
import { EventsModule } from './modules/events/events.module';
import { MatchesModule } from './modules/matches/matches.module';

@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: 'dev.env',
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          `mongodb://${configService.get<string>('DATABASE_USER')}` +
          `:${configService.get<string>('DATABASE_PWD')}` +
          `@${configService.get<string>('DATABASE_HOST')}`,
        dbName: `${configService.get<string>('DATABASE_NAME')}`,
        autoIndex: false,
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: MatchThrows.name, schema: MatchThrowsSchema },
      { name: Throw.name, schema: ThrowSchema },
      { name: Dart.name, schema: DartSchema },
    ]),
    UsersModule,
    FriendRequestsModule,
    TournamentsModule,
    ClubsModule,
    CaslModule,
    AuthModule,
    ChatModule,
    NotificationsModule,
    PostsModule,
    EventsModule,
    MatchesModule,
  ],
  controllers: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppModule {}
