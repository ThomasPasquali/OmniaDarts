import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TextMessage } from '../classes/textMessage';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat extends Document {
  @Prop({
    default: [],
  })
  messages: TextMessage[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
