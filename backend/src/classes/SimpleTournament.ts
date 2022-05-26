import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Gamemodes from 'src/enums/gamemodes';
import TournamentTypes from 'src/enums/tournamentTypes';
import { getEnumDescription } from 'src/utils/utils';
import WinningMode from './winningmode';

export default class SimpleTournament {
  @ApiProperty({
    description: "Tournaments's name",
    required: false,
    default: 'Best tournament',
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
  @ApiProperty({
    enum: Gamemodes,
    example: getEnumDescription(Gamemodes),
    required: true,
  })
  gamemode: string;
  @ApiProperty({
    required: true,
  })
  winningMode: WinningMode;
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
