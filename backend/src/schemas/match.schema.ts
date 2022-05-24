import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import Lobby from "../classes/lobby";

export type MatchDocument = Match & Document;

@Schema()
export class Match extends Document {

  @Prop({ default: new Date()})
  @ApiProperty()
  dateTime: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @ApiProperty()
  players: User[];

  @Prop({ type: Lobby, default: null })
  lobby: Lobby;

}

export const MatchSchema = SchemaFactory.createForClass(Match);
