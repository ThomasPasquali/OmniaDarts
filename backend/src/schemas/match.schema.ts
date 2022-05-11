import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';

export type MatchDocument = Match  & Document;

@Schema()
export class Match {

  @Prop()
    dateTime: Date;
  
    @Prop()
    players: User[];

}

export const MatchSchema = SchemaFactory.createForClass(Match);