import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Match } from './match.schema';

export type TournamentsDocument = Tournaments & Document;

@Schema()
export class Tournaments {
  
  @Prop()
  name: string;

  @Prop()
  timestamp: Date;

  @Prop()
  type: string;

  @Prop()
  gamemode: string;

  @Prop(raw({
    goal: { type: Number },
    firstBest: { type: String },
    setsLegs: { type: String}
  }))
  winningMode: Record<string, any>;

  @Prop()
  matches: Match[];

}

export const TournamentsSchema = SchemaFactory.createForClass(Tournaments);