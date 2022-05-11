import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Match } from './match.schema';
import { TextMessage } from './textMessage.schema';
import { User } from './user.schema';

export type ClubDocument = Club & Document;

@Schema()
export class Club {
  
  @Prop()
  nome: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  admin: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  players: User[];

  @Prop()
  imageUri: string;

  @Prop()
  description: string;

  @Prop()
  messages: TextMessage[];

}

export const ClubSchema = SchemaFactory.createForClass(Club);