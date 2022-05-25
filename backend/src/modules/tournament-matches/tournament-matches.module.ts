import { Module } from '@nestjs/common';
import { TournamentMatchesService } from './tournament-matches.service';
import { TournamentMatchesController } from './tournament-matches.controller';

@Module({
  controllers: [TournamentMatchesController],
  providers: [TournamentMatchesService]
})
export class TournamentMatchesModule {}
