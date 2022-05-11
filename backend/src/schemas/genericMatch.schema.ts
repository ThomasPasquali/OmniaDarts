import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Match } from './match.schema';

export type GenericMatchDocument = GenericMatch  & Document;

@Schema()
export class GenericMatch extends Match{
  
  @Prop()
  gamemode: string;

  @Prop(raw({
    goal: { type: Number },
    firstBest: { type: String },
    setsLegs: { type: String}
  }))
  winningMode: Record<string, any>;

}

export const GenericMatchSchema = SchemaFactory.createForClass(GenericMatch);