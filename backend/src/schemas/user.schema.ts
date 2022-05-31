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
import { Tournament } from './tournaments.schema';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({
    default: 'nick',
  })
  @ApiProperty({
    description: 'The nickname of the user',
    required: true,
  })
  nickname: string;

  @Prop({
    default: '',
  })
  @ApiPropertyOptional()
  firstname: string;

  @Prop({
    default: '',
  })
  @ApiPropertyOptional()
  lastname: string;

  @Prop({
    default: '',
  })
  @ApiPropertyOptional()
  country: string;

  @Prop()
  @ApiPropertyOptional()
  googleToken: string;

  @Prop()
  @ApiProperty({
    required: true,
  })
  pwd: string;

  @Prop({ default: 'https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png' })
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
  friendRequests: FriendRequest[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Club.name, default: null })
  @ApiPropertyOptional()
  @ApiProperty()
  club: Club;

  @Prop({ default: null })
  @ApiHideProperty()
  clubRequest: ClubRequest;

  @Prop({
    default: false,
  })
  @ApiHideProperty()
  isAdmin: boolean;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' }],
  })
  @ApiProperty({
    required: false,
    default: [],
  })
  tournaments: Tournament[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ nickname: 1 }, { unique: true });
