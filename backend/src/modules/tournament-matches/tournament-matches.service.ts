import { Injectable } from '@nestjs/common';
import { CreateTournamentMatchDto } from './dto/create-tournament-match.dto';
import { UpdateTournamentMatchDto } from './dto/update-tournament-match.dto';

@Injectable()
export class TournamentMatchesService {
  create(createTournamentMatchDto: CreateTournamentMatchDto) {
    return 'This action adds a new tournamentMatch';
  }

  findAll() {
    return `This action returns all tournamentMatches`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tournamentMatch`;
  }

  update(id: number, updateTournamentMatchDto: UpdateTournamentMatchDto) {
    return `This action updates a #${id} tournamentMatch`;
  }

  remove(id: number) {
    return `This action removes a #${id} tournamentMatch`;
  }
}
