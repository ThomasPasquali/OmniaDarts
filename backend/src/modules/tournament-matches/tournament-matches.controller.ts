import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TournamentMatchesService } from './tournament-matches.service';
import { CreateTournamentMatchDto } from './dto/create-tournament-match.dto';
import { UpdateTournamentMatchDto } from './dto/update-tournament-match.dto';

@Controller('tournament-matches')
export class TournamentMatchesController {
  constructor(private readonly tournamentMatchesService: TournamentMatchesService) {}

  @Post()
  create(@Body() createTournamentMatchDto: CreateTournamentMatchDto) {
    return this.tournamentMatchesService.create(createTournamentMatchDto);
  }

  @Get()
  findAll() {
    return this.tournamentMatchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentMatchesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTournamentMatchDto: UpdateTournamentMatchDto) {
    return this.tournamentMatchesService.update(+id, updateTournamentMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentMatchesService.remove(+id);
  }
}
