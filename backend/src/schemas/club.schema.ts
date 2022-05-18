import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { TextMessage } from './textMessage.schema';
import { User } from './user.schema';
import Post from "../classes/post";

export type ClubDocument = Club & Document;

@Schema()
export class Club extends mongoose.Document{
  @Prop()
  @ApiProperty()
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @ApiProperty()
  admin: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @ApiProperty()
  players: User[];

  @Prop({
    default: String,
  })
  @ApiProperty()
  imageUri: string;

  @Prop({
        default: []
      })
  @ApiProperty()
  posts: Post[];

  @Prop()
  @ApiProperty()
  description: string;

  @Prop()
  @ApiProperty()
  messages: TextMessage[];
}

export const ClubSchema = SchemaFactory.createForClass(Club);
