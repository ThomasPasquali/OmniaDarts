import { ApiProperty } from '@nestjs/swagger';

export default class SimpleUser {
  @ApiProperty({
    description: "User's nickname",
  })
  nickname: string;
  @ApiProperty({
    description: "User's password",
  })
  pwd: string;
}
