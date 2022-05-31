import { ApiProperty } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

export default class ClubPost {
  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  fileRelativeUri: string;

  user: User;

  dateTime: number;
}
