import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Tournament,
  TournamentsSchema,
} from '../../schemas/tournaments.schema';
import { ClubsModule } from '../clubs/clubs.module';
import { MatchesModule } from '../matches/matches.module';
import { TournamentMatchesModule } from '../tournament-matches/tournament-matches.module';
import { UsersModule } from '../users/users.module';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';

@Module({
  imports: [
    UsersModule,
    ClubsModule,
    TournamentMatchesModule,
    MatchesModule,
    MongooseModule.forFeature([
      {
        name: Tournament.name,
        schema: TournamentsSchema,
      },
    ]),
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
  exports: [TournamentsService],
})
export class TournamentsModule {}
