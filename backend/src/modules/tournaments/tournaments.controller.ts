import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
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
  /* 
  Aggiungi tournament
   */
}
