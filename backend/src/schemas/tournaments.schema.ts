import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import WinningMode from '../classes/winningmode';
import Gamemodes from '../enums/gamemodes';
import TournamentTypes from '../enums/tournamentTypes';
import { getEnumDescription } from '../utils/utils';
import { Club } from './club.schema';
import { TournamentMatch } from './tournamentMatch.schema';
import { User } from './user.schema';

export type TournamentDocument = Tournament & Document;

@Schema()
export class Tournament extends Document {
  @Prop()
  @ApiProperty({
    required: true,
  })
  name: string;

  @Prop()
  @ApiPropertyOptional()
  creation_date: Date;

  @Prop()
  @ApiProperty({
    required: true,
  })
  randomOrder: boolean;

  @Prop()
  @ApiProperty({
    enum: TournamentTypes,
    example: getEnumDescription(TournamentTypes),
    required: false,
    default: true,
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
    maxLength: 100,
    example: '',
  })
  players: User[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TournamentMatch' }],
  })
  @ApiPropertyOptional()
  matches: TournamentMatch[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Club' })
  @ApiPropertyOptional()
  clubRef: Club;

  @Prop()
  @ApiProperty({
    required: true,
    default: false,
  })
  finished: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @ApiProperty({
    required: true,
  })
  creator: User;
}

export const TournamentsSchema = SchemaFactory.createForClass(Tournament);
