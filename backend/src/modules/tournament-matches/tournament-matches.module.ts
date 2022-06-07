import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TournamentMatch,
  TournamentMatchSchema,
} from '../../schemas/tournamentMatch.schema';
import { MatchesModule } from '../matches/matches.module';
import { UsersModule } from '../users/users.module';
import { TournamentMatchesController } from './tournament-matches.controller';
import { TournamentMatchesService } from './tournament-matches.service';

@Module({
  imports: [
    UsersModule,
    MatchesModule,
    MongooseModule.forFeature([
      {
        name: TournamentMatch.name,
        schema: TournamentMatchSchema,
      },
    ]),
  ],
  controllers: [TournamentMatchesController],
  providers: [TournamentMatchesService],
  exports: [TournamentMatchesService],
})
export class TournamentMatchesModule {}
