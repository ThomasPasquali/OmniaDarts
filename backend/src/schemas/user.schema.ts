import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import ClubRequest from '../classes/clubRequest';
import { Club } from './club.schema';
import { FriendRequest } from './friendRequest.schema';
import { Match } from './match.schema';

export type UserDocument = User & Document;

@Schema({
  autoIndex: true,
})
export class User extends Document {
  @Prop({
    default: '',
  })
  @ApiProperty({
    description: 'The nickname of the user',
    required: true,
  })
  nickname: string;

  @Prop()
  @ApiPropertyOptional()
  googleToken: string;

  @Prop()
  @ApiProperty({
    required: true,
  })
  pwd: string;

  @Prop({ default: null })
  @ApiPropertyOptional()
  @ApiHideProperty()
  imageUrl: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Match.name }],
  })
  @ApiPropertyOptional()
  matches: Match[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: FriendRequest.name }],
  })
  @ApiProperty({ type: () => FriendRequest })
  @ApiPropertyOptional()
  friends: FriendRequest[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Club.name, default: null })
  @ApiPropertyOptional()
  @ApiProperty()
  club: Club;

  @Prop()
  @ApiHideProperty()
  clubRequest: ClubRequest;

  @Prop()
  @ApiHideProperty()
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ nickname: 1 }, { unique: true });
