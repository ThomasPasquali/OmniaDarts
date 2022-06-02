import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { Match } from './match.schema';
import { Tournament } from './tournaments.schema';

export type TournamentMatchDocument = TournamentMatch & Document;

@Schema()
export class TournamentMatch extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' })
  @ApiProperty({
    required: true,
  })
  tournamentRef: Tournament;

  @Prop()
  @ApiProperty({
    required: true,
  })
  round: number;

  @Prop()
  @ApiProperty({
    required: true,
  })
  group: number;

  @Prop()
  @ApiProperty()
  numPlayers: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Match' })
  @ApiProperty({
    required: true,
  })
  match: Match;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'TournamentMatch' })
  @ApiProperty()
  nextTournamentMatch: TournamentMatch;
}

export const TournamentMatchSchema =
  SchemaFactory.createForClass(TournamentMatch);
