import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Match } from './match.schema';
import { Throw } from './throw.schema';
import { User } from './user.schema';

export type TournamentMatchDocument = TournamentMatch & Document;

@Schema()
export class TournamentMatch extends Match{
  
  @Prop()
  round: number;

  @Prop()
  group: number;
}

export const TournamentMatchSchema = SchemaFactory.createForClass(TournamentMatch);