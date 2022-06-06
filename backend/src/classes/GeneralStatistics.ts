import { ApiProperty } from '@nestjs/swagger';
import { Statistic } from 'src/schemas/statistics.schema';

export default class GeneralStatistics {
  @ApiProperty({
    description: 'Name of the statistic',
  })
  name: string;
  @ApiProperty({
    description: 'List of statistics',
  })
  stats: Statistic[];
}
