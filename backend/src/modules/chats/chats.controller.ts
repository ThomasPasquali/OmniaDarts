import {
  Controller,
  Get,
  Param,
  Post, UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TextMessage } from '../../classes/textMessage';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatsService } from './chats.service';

@Controller('chat')
@ApiTags('chat')
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ description: 'Create a new chats standalone' })
  @ApiCreatedResponse({ description: 'Created a new chats', type: TextMessage })
  async create() {
    return await this.chatService.create(null, false, false);
  }

  @Get(':id')
  @ApiOperation({ description: 'Find a chats' })
  @ApiOkResponse({ description: 'Found the chats' })
  async findOne(@Param('id') id: string) {
    return await this.chatService.findById(id);
  }
}
