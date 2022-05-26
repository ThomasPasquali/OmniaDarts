import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import Lobby from '../classes/lobby';
import { User } from './user.schema';

export type MatchDocument = Match & Document;

@Schema()
export class Match extends mongoose.Document {
  @Prop()
  @ApiProperty()
  dateTime: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @ApiProperty()
  players: User[];

  @Prop()
  lobby: Lobby;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
