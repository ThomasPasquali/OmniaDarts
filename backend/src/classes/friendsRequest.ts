import { ApiProperty } from '@nestjs/swagger';

export default class FriendsRequest {
  @ApiProperty()
  idUser: string;
  @ApiProperty()
  pending: boolean;
  @ApiProperty()
  isSender: boolean;
}
