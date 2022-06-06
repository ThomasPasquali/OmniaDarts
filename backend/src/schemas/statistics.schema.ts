import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema()
export class Statistic extends mongoose.Document {
  @Prop()
  @ApiProperty({
    description: 'Statistic name',
  })
  stat: string;
  @Prop()
  @ApiProperty({
    description: 'Statistic value',
  })
  value: number;
  @Prop()
  @ApiProperty({
    description: 'Is statistic a percentage',
  })
  isPercentage: boolean;
}
