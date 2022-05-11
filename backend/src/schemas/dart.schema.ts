import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Coordinates } from './coordinates.schema';
import { User } from './user.schema';

export type DartDocument = Dart & Document;

@Schema()
export class Dart {
  
  @Prop()
  sector: number;

  @Prop()
  doubleTriple: string;

  @Prop()
  coordinates: Coordinates;

}

export const DartSchema = SchemaFactory.createForClass(Dart);