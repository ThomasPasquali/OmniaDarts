import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Coordinates } from './coordinates.schema';
import { User } from './user.schema';
import {ApiProperty} from "@nestjs/swagger";

export type DartDocument = Dart & Document;

@Schema()
export class Dart {
  
  @Prop()
  @ApiProperty({
    description: 'The sector of the board',
    required: true,
    default: 0,
  })
  sector: number;

  @Prop()
  @ApiProperty({
    description: 'null for single, D for double, T for triple',
    required: true,
    enum: ['D', 'T'],
    default: null,
  })
  doubleTriple: string;

  @Prop()
  @ApiProperty({
    description: 'Coordinates on a 1000x1000 view',
    required: true,
    default: null,
  })
  coordinates: Coordinates;

}

export const DartSchema = SchemaFactory.createForClass(Dart);