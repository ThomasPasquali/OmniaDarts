import { ApiProperty } from '@nestjs/swagger';
import { Club } from 'src/schemas/club.schema';

export default class ClubRequest {
  
  @ApiProperty()
  club: Club;

  @ApiProperty()
  message: string;

}