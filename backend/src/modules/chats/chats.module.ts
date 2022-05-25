import { forwardRef, Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '../../schemas/chat.schema';
import { ChatsGateway } from '../events/chats.gateway';
import { EventsModule } from '../events/events.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ClubsModule } from '../clubs/clubs.module';
import {MatchesModule} from "../matches/matches.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    forwardRef(() => MatchesModule),
    forwardRef(() => ClubsModule),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
