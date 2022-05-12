import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { Match } from './match.schema';

export type UserDocument = User & Document;

@Schema({
  autoIndex: true
})
export class User {
  
  @Prop()
  @ApiProperty()
  nickname: string;

  @Prop()
  @ApiProperty()
  pwd: string;

  @Prop()
  @ApiProperty()
  imageUrl: string;

  @Prop()
  @ApiProperty()
  matches: Match[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @ApiProperty()
  friends: User[];

}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ nickname: 1}, { unique: true });