import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Dart } from './dart.schema';
import { User } from './user.schema';

export type ThrowDocument = Throw & Document;

@Schema()
export class Throw {
  
  @Prop()
  darts: Dart[];

  @Prop()
  score: Number;

}

export const ThrowSchema = SchemaFactory.createForClass(Throw);