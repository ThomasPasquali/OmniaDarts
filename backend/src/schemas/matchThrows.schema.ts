import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Match } from './match.schema';
import { Throw } from './throw.schema';
import { User } from './user.schema';

export type MatchThrowsDocument = MatchThrows & Document;

@Schema()
export class MatchThrows {
  
  @Prop()
  throws: Throw[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Match' })
  match: Match;

}

export const MatchThrowsSchema = SchemaFactory.createForClass(MatchThrows);