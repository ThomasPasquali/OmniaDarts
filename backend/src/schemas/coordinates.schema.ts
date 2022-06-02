import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import {ApiProperty} from "@nestjs/swagger";

export type CoordinatesDocument = Coordinates & Document;

@Schema()
export class Coordinates {
  
  @Prop()
  @ApiProperty({
    description: 'x',
    required: true,
    default: 0,
  })
  x: Number;

  @Prop()
  @ApiProperty({
    description: 'y',
    required: true,
    default: 0,
  })
  y: Number;

}

export const CoordinatesSchema = SchemaFactory.createForClass(Coordinates);