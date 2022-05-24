import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '../../schemas/chat.schema';
import { TextchatsGateway } from './textchats.gateway';
import { EventsModule } from '../events/events.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ClubsModule } from '../clubs/clubs.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    forwardRef(() => ClubsModule),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  controllers: [ChatController],
  providers: [ChatService, TextchatsGateway],
  exports: [ChatService],
})
export class ChatModule {}
