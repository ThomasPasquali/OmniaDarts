import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Tournament,
  TournamentsSchema,
} from '../../schemas/tournaments.schema';
import { ClubsModule } from '../clubs/clubs.module';
import { TournamentMatchesModule } from '../tournament-matches/tournament-matches.module';
import { UsersModule } from '../users/users.module';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';

@Module({
  imports: [
    UsersModule,
    ClubsModule,
    TournamentMatchesModule,
    // forwardRef(() => TournamentMatchesModule),
    // https://stackoverflow.com/questions/65437975/the-module-at-index-1-is-of-type-undefined-check-your-import-statements-and
    MongooseModule.forFeature([
      { name: Tournament.name, schema: TournamentsSchema },
    ]),
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
  exports: [TournamentsService],
})
export class TournamentsModule {}
