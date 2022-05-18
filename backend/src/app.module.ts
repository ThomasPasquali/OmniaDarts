import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { Dart, DartSchema } from './schemas/dart.schema';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchThrows, MatchThrowsSchema } from './schemas/matchThrows.schema';
import { Throw, ThrowSchema } from './schemas/throw.schema';
import { FriendsModule } from './modules/friends/friends.module';
import { CaslModule } from './modules/casl/casl.module';
import { SchemasModule } from './schemas/schemas.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { PostsModule } from './modules/clubs/posts/posts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
      PostsModule,
    FriendsModule,
    TournamentsModule,
    ClubsModule,
    CaslModule,
    AuthModule,
    SchemasModule,
    FriendsModule,
  ],
  controllers: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppModule {}
