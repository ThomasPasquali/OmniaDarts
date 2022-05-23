import { ApiProperty } from '@nestjs/swagger';

export default class SimpleUser {
  @ApiProperty({
    description: 'Nickname of the user1',
  })
  nickname: string;
  @ApiProperty({
    description: 'Password of the user1',
  })
  pwd: string;
}
