import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import Post from '../classes/post';
import { Chat } from './chat.schema';
import { User } from './user.schema';

export type ClubDocument = Club & Document;

@Schema()
export class Club extends mongoose.Document {
  @Prop()
  @ApiProperty({
    description: 'Name of the club',
    required: true,
    default: 'club_name',
  })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @ApiProperty({
    description: 'List of the members of the club',
    required: false,
    default: [],
  })
  players: User[];

  @Prop()
  @ApiProperty({
    description: 'Image of the club',
    required: false,
  })
  imageUri: string;

  @Prop({
    default: [],
  })
  @ApiProperty({
    description: 'Posts of the club',
    required: false,
    default: [],
  })
  posts: Post[];

  @Prop()
  @ApiProperty({
    description: 'Small description of the club',
    required: false,
    default: null,
  })
  description: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Chat.name }] })
  @ApiProperty({
    description: 'Chat inside the club',
    required: false,
    default: null,
  })
  chat: Chat;
}

export const ClubSchema = SchemaFactory.createForClass(Club);
