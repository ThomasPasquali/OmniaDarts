import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { Match } from './match.schema';

export type UserDocument = User & Document;

@Schema({
  autoIndex: true
})
export class User extends mongoose.Document{
  
  @Prop()
  @ApiProperty()
  nickname: string;

  @Prop()
  @ApiProperty()
  googleToken: string;

  @Prop()
  @ApiProperty()
  pwd: string;

  @Prop()
  @ApiProperty()
  imageUrl: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
  })
  @ApiProperty()
  matches: Match[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @ApiProperty()
  friends: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ nickname: 1}, { unique: true });
