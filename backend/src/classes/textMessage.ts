import { User } from '../schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class TextMessage {
  @ApiProperty()
  user: User;

  @ApiProperty()
  dateTime: number;

  @ApiProperty()
  text: string;
}
