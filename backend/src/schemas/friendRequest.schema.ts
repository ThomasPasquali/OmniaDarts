import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

export type FriendRequestDocument = FriendRequest & Document;

@Schema()
export class FriendRequest extends Document {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  @ApiProperty({ type: () => User })
  user: User;

  @Prop({ required: true })
  @ApiProperty()
  isSender: boolean;

  @Prop({
    default: true,
  })
  @ApiProperty()
  pending: boolean;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
