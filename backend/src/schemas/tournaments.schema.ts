import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import WinningMode from '../classes/winningmode';
import Gamemodes from '../enums/gamemodes';
import TournamentTypes from '../enums/tournamentTypes';
import { getEnumDescription } from '../utils/utils';
import { TournamentMatch } from './tournamentMatch.schema';
import { User } from './user.schema';

export type TournamentDocument = Tournament & Document;

@Schema()
export class Tournament {
  @Prop()
  @ApiProperty({
    required: false,
  })
  name: string;

  @Prop()
  timestamp: Date;

  @Prop()
  @ApiProperty({
    enum: TournamentTypes,
    example: getEnumDescription(TournamentTypes),
    required: true,
  })
  type: string;

  @Prop()
  @ApiProperty({
    enum: Gamemodes,
    example: getEnumDescription(Gamemodes),
    required: true,
  })
  gamemode: string;

  @Prop()
  @ApiProperty({
    required: true,
  })
  winningMode: WinningMode;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @ApiProperty({
    isArray: true,
    required: true,
    minLength: 4,
    example: '',
  })
  players: User[];

  @Prop()
  torunamentMatches: TournamentMatch[];
}

export const TournamentsSchema = SchemaFactory.createForClass(Tournament);
