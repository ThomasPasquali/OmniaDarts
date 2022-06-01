import { ApiProperty } from '@nestjs/swagger';
import ResponseContent from './responseContent';

export default class ModResponse {
  @ApiProperty({
    default: 400,
  })
  statusCode: number;
  @ApiProperty({
    default: new Date().toISOString(),
  })
  timestamp: Date;
  @ApiProperty({
    default: '/endpoint/query',
  })
  path: string;
  @ApiProperty()
  content: ResponseContent;
}
