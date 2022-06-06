import { Prop } from '@nestjs/mongoose';
import { Dart } from '../schemas/dart.schema';
import {ApiProperty} from "@nestjs/swagger";

export default class Throw {

  @Prop()
  @ApiProperty({
    description: '<leg>:<set> of the throw',
    required: true,
    default: '0:0',
  })
  legSet: string;

  @Prop()
  @ApiProperty({
    description: 'The darts thrown',
    required: false,
    maxLength: 3,
    minLength: 1,
    default: [{
      sector: 0,
      doubleTriple: null,
    }],
  })
  darts: Dart[];

  @Prop()
  @ApiProperty({
    description: 'The global score of the throw (if darts are present will be overwritten)',
    required: true,
    default: 0,
  })
  score: number;

}