import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Tournament } from '../../schemas/tournaments.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TournamentsService } from './tournaments.service';

@Controller('tournaments')
@ApiTags('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentService: TournamentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create a new tournament' })
  @ApiCreatedResponse({
    description: 'A new tournament has been created',
    type: Tournament,
  })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @HttpCode(HttpStatus.CREATED)
  async newTournament(@Body() tournament: Tournament) {
    return await this.tournamentService.create(tournament);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Get all available tournaments (finished and not)',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'The list of all tournaments (finished and not)',
    type: [Tournament],
  })
  async getAllTournamentsAvailable(): Promise<Tournament[]> {
    const tournaments = await this.tournamentService.findAll();
    tournaments.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return tournaments;
  }

  @Get(':tournamentName')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description:
      'Get all available tournaments ordered by creation (from new to old)',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description:
      'The list of all available tournaments ordered by creation (from new to old)',
    type: [Tournament],
  })
  async getTournamentsByName(
    @Req() req,
    @Param('tournamentName') tournamentName: string,
  ): Promise<Tournament[]> {
    const tournaments = await this.getAllTournamentsAvailable();
    tournaments.filter(
      (t) =>
        t.name.toLowerCase().includes(tournamentName.toLowerCase()) &&
        t.players.includes(req.user),
    );
    return tournaments;
  }
}
