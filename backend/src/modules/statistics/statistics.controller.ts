import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import GeneralStatistics from 'src/classes/GeneralStatistics';
import { Statistic } from 'src/schemas/statistics.schema';
import { User } from 'src/schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('statistics')
@ApiTags('statistics')
export class StatisticsController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get statistics of the current user',
  })
  @ApiOkResponse({
    description: 'Statistics generated',
    type: [GeneralStatistics],
  })
  @HttpCode(HttpStatus.OK)
  async getStats(@Req() req): Promise<GeneralStatistics[]> {
    const currUser = await this.usersService.findById(req.user._id);
    const stats: GeneralStatistics[] = this.generateStats(currUser);
    return stats;
  }

  private generateStats(user: User): GeneralStatistics[] {
    let stats: GeneralStatistics[] = [];

    const games_played: Statistic = this.generateSingularStat(
      'Games played',
      user.matches.length,
    );
    const games_won: Statistic = this.generateSingularStat(
      'Games won',
      0,
      // user.matches.filter((m) => m.winner._id.toString() == user._id.toString())
      // .length,
    );
    const win_rate: Statistic = this.generateSingularStat(
      'Win rate',
      games_won.value != 0 ? games_played.value / games_won.value : 0,
      true,
    );
    stats.push({
      name: 'Win statistics',
      stats: [games_played, games_won, win_rate],
    } as GeneralStatistics);

    return stats;
  }

  private generateSingularStat(
    stat: string,
    value: number,
    isPercentage: boolean = false,
  ): Statistic {
    return {
      stat: stat,
      value: value,
      isPercentage: isPercentage,
    } as Statistic;
  }
}
