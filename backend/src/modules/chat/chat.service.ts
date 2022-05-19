import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Club, ClubDocument } from '../../schemas/club.schema';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../../schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  async create() {
    const initChat = { messages: [] } as Chat;
    const createdClub = new this.chatModel(initChat);
    return createdClub.save();
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
