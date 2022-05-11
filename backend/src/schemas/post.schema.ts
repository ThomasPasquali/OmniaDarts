import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Match } from './match.schema';
import { User } from './user.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  
  @Prop()
  text: string;

  @Prop()
  imageUri: string;

  @Prop()
  dateTime: Date;

}

export const PostSchema = SchemaFactory.createForClass(Post);