import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { TextMessage } from '../../classes/textMessage';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation, ApiTags,
} from '@nestjs/swagger';
import { User } from '../../schemas/user.schema';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ description: 'Create a new chat standalone' })
  async create() {
    return await this.chatService.create();
  }

  @Get(':id')
  @ApiOperation({ description: 'Find a chat' })
  async findOne(@Param('id') id: string) {
    return this.chatService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Write a message on a specific chat' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'club updated', type: TextMessage })
  @Patch(':id')
  async addMessage(
    @Req() req,
    @Param('id') id: string,
    @Body('message') message: string,
  ) {
    const chat = await this.chatService.findById(id);
    const textMessage = new TextMessage();
    textMessage.user = {
      _id: req.user._id,
      nickname: req.user.nickname,
    } as User;
    textMessage.text = message;
    textMessage.dateTime = new Date().getTime();
    chat.messages.push(textMessage);
    await this.chatService.update(id, chat);
    return textMessage;
  }
}
