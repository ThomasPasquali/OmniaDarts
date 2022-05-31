import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TournamentMatch,
  TournamentMatchSchema,
} from 'src/schemas/tournamentMatch.schema';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { TournamentMatchesController } from './tournament-matches.controller';
import { TournamentMatchesService } from './tournament-matches.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TournamentMatch.name,
        schema: TournamentMatchSchema,
      },
    ]),
    // forwardRef(() => TournamentsModule),
  ],
  controllers: [TournamentMatchesController],
  providers: [TournamentMatchesService],
  exports: [TournamentMatchesService],
})
export class TournamentMatchesModule {}
