import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchThrows, MatchThrowsSchema } from './schemas/matchThrows.schema';
import { Throw, ThrowSchema } from './schemas/throw.schema';
import { Dart, DartSchema } from './schemas/dart.schema';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FriendsModule } from './modules/friends/friends.module';
import { CaslModule } from './modules/casl/casl.module';
import { SchemasModule } from './schemas/schemas.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: 'dev.env',
    }),

    MongooseModule
        .forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService :ConfigService) => ({
            uri: `mongodb://${configService.get<string>('DATABASE_USER')}`
                            + `:${configService.get<string>('DATABASE_PWD')}`
                            + `@${configService.get<string>('DATABASE_HOST')}`,
            dbName: `${configService.get<string>('DATABASE_NAME')}`,
            connectionFactory: (connection) => {
              connection.plugin(require('mongoose-autopopulate'));
              return connection;
            } 
          }),
          inject: [ConfigService]
        }),
    
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: MatchThrows.name, schema: MatchThrowsSchema },
      { name: Throw.name, schema: ThrowSchema },
      { name: Dart.name, schema: DartSchema },
    ]),
  UsersModule,
  FriendsModule,
  TournamentsModule,
  ClubsModule,
  CaslModule,
  AuthModule,
  SchemasModule,
  ],
  controllers: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppModule {}
