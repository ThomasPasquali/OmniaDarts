import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TextMessage } from '../classes/textMessage';
import {Club} from "./club.schema";

export type ChatDocument = Chat & Document;

@Schema()
export class Chat extends Document {
  @Prop({
    default: [],
  })
  messages: TextMessage[];

  @Prop({
    type: Object
  })
  club: Club;

  @Prop({
    default: true,
  })
  isPersitent: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  isPublic: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
