import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Match } from './match.schema';

export type TournamentMatchDocument = TournamentMatch & Document;

@Schema()
export class TournamentMatch extends Match {
  
  @Prop()
  round: number;

  @Prop()
  group: number;
}

export const TournamentMatchSchema = SchemaFactory.createForClass(TournamentMatch);