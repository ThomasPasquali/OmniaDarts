import {Prop, raw, Schema, SchemaFactory} from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import Lobby from "../classes/lobby";
import PlayerThrows from "../classes/playerThrows";
import Throw from "../classes/throw";

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

  //public final HashMap<String, Stack<CompleteThrow>> playerThrows;
  @Prop({ type: raw({}), default: {} })
  gameThrows: Record<string, PlayerThrows>;

  public addThrow(user: User, setLeg: string, newThrow: Throw) {
    const uID = user._id.toString();
    !this.gameThrows[uID] && (this.gameThrows[uID] = new PlayerThrows(uID));
    this.gameThrows[uID].addThrow(setLeg, newThrow);
  }
}

export const MatchSchema = SchemaFactory.createForClass(Match);
