import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Match } from './match.schema';
import { User } from './user.schema';

export type TextMessageDocument = TextMessage & Document;

@Schema()
export class TextMessage {
  
  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } })
  admin: User;

  @Prop()
  dateTime: Date;

  @Prop()
  text: string;

}

export const TextMessageSchema = SchemaFactory.createForClass(TextMessage);