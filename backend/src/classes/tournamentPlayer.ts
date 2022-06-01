import { ApiProperty } from '@nestjs/swagger';

export class TournamentPlayer {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  result: number;
}
