import { ApiProperty } from '@nestjs/swagger';

export default class ResponseContent {
  @ApiProperty({
    default: 'title_of_the_response',
    description: 'front end texts',
  })
  title: string;
  @ApiProperty({
    default: 'description_of_the_response',
    description: 'front end texts',
  })
  description: string;
  @ApiProperty({
    default: 'error message of the response ',
  })
  message: string;
  @ApiProperty({
    description: 'Payload',
  })
  payload: any;
}
