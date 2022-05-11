import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';

export type CoordinatesDocument = Coordinates & Document;

@Schema()
export class Coordinates {
  
  @Prop()
  x: Number;

  @Prop()
  y: Number;

}

export const CoordinatesSchema = SchemaFactory.createForClass(Coordinates);