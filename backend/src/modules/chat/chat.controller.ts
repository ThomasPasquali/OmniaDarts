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
import { User } from '../../schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ description: 'Create a new chat standalone' })
  @ApiCreatedResponse({ description: 'Created a new chat', type: TextMessage })
  async create() {
    return await this.chatService.create();
  }

  @Get(':id')
  @ApiOperation({ description: 'Find a chat' })
  @ApiOkResponse({ description: 'Found the chat' })
  async findOne(@Param('id') id: string) {
    return await this.chatService.findById(id);
  }
}
