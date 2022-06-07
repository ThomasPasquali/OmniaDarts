import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import TournamentTypes from '../enums/tournamentTypes';
import { getEnumDescription } from '../utils/utilFunctions';
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

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
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

  @Prop()
  @ApiProperty()
  numRounds: number;
}

export const TournamentsSchema = SchemaFactory.createForClass(Tournament);
