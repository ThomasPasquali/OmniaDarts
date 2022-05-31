import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../../schemas/chat.schema';
import {Club} from "../../schemas/club.schema";

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  async create(club: Club, isPersistent: boolean, isPublic: boolean) {
    const initChat = {
      club: club,
      playersIDs: [],
      isPublic: isPublic,
      isPersitent: isPersistent,
      messages: []
    } as Chat;
    const chat = await new this.chatModel(initChat).save();
    return chat;
  }

  async findById(id: string) {
    return this.chatModel.findById(id).lean();
  }

  async update(id: string, chat: Chat) {
    return this.chatModel.findByIdAndUpdate(id, chat, { new: true }).lean();
  }
}
