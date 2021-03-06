import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import TournamentTypes from '../enums/tournamentTypes';
import { getEnumDescription } from '../utils/utilFunctions';

export default class SimpleTournament {
  @ApiProperty({
    description: "Tournaments's name",
    required: false,
    default: 'tournament_name',
  })
  name: string;

  @ApiProperty({
    description: 'Set the users at random order inside the tournament',
    required: false,
    default: true,
  })
  randomOrder: boolean;

  @ApiProperty({
    enum: TournamentTypes,
    example: getEnumDescription(TournamentTypes),
    required: true,
  })
  type: string;

  @ApiProperty()
  gamemode: Record<string, any>;

  @ApiProperty()
  winningMode: Record<string, any>;

  @ApiProperty({
    isArray: true,
    // required: true, TODO change
    minLength: 4,
    maxLength: 100,
    default: [],
  })
  idPlayers: string[];

  @ApiPropertyOptional({
    default: null,
  })
  idClub: string;
}
