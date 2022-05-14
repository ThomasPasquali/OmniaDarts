import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from 'src/schemas/club.schema';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Club.name, schema: ClubSchema }]),
  ],
  controllers: [ClubsController],
  providers: [ClubsService],
})
export class ClubsModule {}
