import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { User } from './user.schema';

export type MatchDocument = Match & Document;

@Schema()
export class Match {
  @Prop()
  @ApiProperty()
  dateTime: Date;

  @Prop()
  @ApiProperty()
  players: User[];
}

export const MatchSchema = SchemaFactory.createForClass(Match);
