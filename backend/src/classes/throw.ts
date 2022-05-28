import { Prop } from '@nestjs/mongoose';
import { Dart } from '../schemas/dart.schema';

export default class Throw {

  @Prop()
  darts: Dart[];

  @Prop()
  score: number;

}