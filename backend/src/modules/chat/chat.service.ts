import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Club, ClubDocument } from '../../schemas/club.schema';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../../schemas/chat.schema';
import {ChatGateway} from "./chat.gateway";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    private readonly chatGateway: ChatGateway,
  ) {}

  async create() {
    const initChat = { messages: [] } as Chat;
    const chat = await new this.chatModel(initChat).save();
    this.chatGateway.newRoom(chat)
    return chat;
  }

  async findById(id: string) {
    return this.chatModel.findById(id).lean();
  }

  async update(id: string, chat: Chat) {
    return this.chatModel
        .findByIdAndUpdate(id, chat, { new: true })
        .lean();
  }
}
