import {Prop, raw, Schema, SchemaFactory} from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import Lobby from "../classes/lobby";
import {FirstBest, GamemodeName, SetsLegs} from "../enums/matches";
import {MatchSettings} from "../interfaces/match";
import TournamentTypes from "../enums/tournamentTypes";
import {getEnumDescription} from "../utils/utils";

export type MatchDocument = Match & Document;

@Schema()
export class Match extends Document {

  @Prop({ default: new Date()})
  @ApiProperty()
  dateTime: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  @ApiProperty()
  players: User[];

  @Prop({ type: Lobby, default: null })
  lobby: Lobby;

  @Prop({ type: Boolean, default: false })
  done: boolean;

  @Prop(raw({
    name: { type: String/*GamemodeName*/ },
    settings: { type: Object/*MatchSettings*/ },
  }))
  @ApiProperty()
  gamemode: Record<string, any>;

  @Prop(raw({
    goal: { type: Number },
    firstBest: { type: String },/*{ enum: () => FirstBest }*/
    setsLegs: { type: String }, /*{ enum: () => SetsLegs }*/
  }))
  @ApiProperty()
  winningMode: Record<string, any>;

}

export const MatchSchema = SchemaFactory.createForClass(Match);
