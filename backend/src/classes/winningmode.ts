import { ApiProperty } from '@nestjs/swagger';

export default class WinningMode {
  @ApiProperty()
  goal: number;
  @ApiProperty()
  firstBest: string;
  @ApiProperty()
  setsLegs: string;
}
