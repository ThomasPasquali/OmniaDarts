import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import Lobby from '../classes/lobby';
import MatchResult from '../classes/matchResult';
import PlayerThrows, { playerThrowsAddThrow } from '../classes/playerThrows';
import Throw from '../classes/throw';
import { User } from './user.schema';

export type MatchDocument = Match & Document;

@Schema()
export class Match extends Document {
  @Prop({ default: new Date() })
  @ApiProperty()
  dateTime: Date;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  @ApiProperty()
  players: User[];

  @Prop({ type: Lobby, default: null })
  lobby: Lobby;

  @Prop({ type: Boolean, default: false })
  started: boolean;

  @Prop({ type: Boolean, default: false })
  done: boolean;

  @Prop(
    raw({
      name: { type: String /*GamemodeName*/ },
      settings: { type: Object /*MatchSettings*/ },
    }),
  )
  @ApiProperty()
  gamemode: Record<string, any>;

  @Prop(
    raw({
      goal: { type: Number },
      firstBest: { type: String } /*{ enum: () => FirstBest }*/,
      setsLegs: { type: String } /*{ enum: () => SetsLegs }*/,
    }),
  )
  @ApiProperty()
  winningMode: Record<string, any>;

  @Prop({ type: raw({}), default: {} })
  playersThrows: Record<string, PlayerThrows>;

  @Prop({ type: Array, default: [] })
  results: MatchResult[];

  /* @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  })
  @ApiProperty({ description: 'The winner of the match' })
  winner: User; */
}

export const MatchSchema = SchemaFactory.createForClass(Match);

export function matchAddThrow(match: Match, user: User, newThrow: Throw) {
  const uID = user._id.toString();
  !match.playersThrows[uID] &&
    (match.playersThrows[uID] = new PlayerThrows(uID));
  playerThrowsAddThrow(match.playersThrows[uID], newThrow);
}
