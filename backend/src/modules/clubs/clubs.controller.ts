import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Club } from '../../schemas/club.schema';
import { ClubsService } from './clubs.service';

@Controller('clubs')
@ApiTags('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}
  @Post()
  @ApiOperation({ description: 'Create a club' })
  @ApiCreatedResponse({
    description: 'A new club has been created',
    type: Club,
  })
  async addClub(@Body() club: Club, @Res() response) {
    const newClub = await this.clubsService.addClub(club);
    return response.status(HttpStatus.CREATED).json(newClub);
  }
}
