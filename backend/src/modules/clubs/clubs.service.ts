import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, ClubDocument } from '../../schemas/club.schema';
import Notification from '../../classes/notification';
import { User } from '../../schemas/user.schema';
import { NotificationState } from '../../enums/notifications';
import { NotificationsProvider } from '../../interfaces/notifications';

@Injectable()
export class ClubsService implements NotificationsProvider {
  constructor(
    @InjectModel(Club.name) private readonly clubModel: Model<ClubDocument>,
  ) {}

  async addClub(club: Club): Promise<Club> {
    const createdClub = new this.clubModel(club);
    return createdClub.save();
  }

  async findAll(): Promise<Club[]> {
    return this.clubModel.find().exec();
  }

  async getClubById(id: string): Promise<Club> {
    return this.clubModel.findById(id).populate('players').lean();
  }

  async update(id, club: Club): Promise<Club> {
    return this.clubModel
      .findByIdAndUpdate(id, club, { new: true })
      .populate('players')
      .lean();
  }

  async delete(id): Promise<Club> {
    return await this.clubModel.findByIdAndDelete(id).exec();
  }

  async getNotifications(user: User): Promise<Notification[]> {
    const notifications: Notification[] = [];
    if (user.club != null) {
      if (user.isAdmin) {
        const club: Club = await this.getClubById(user.club._id);
        const requests = club.players.filter((u) => u.clubRequest != null);
        for (const r of requests)
          notifications.push(
            new Notification(
              'notification_club_request',
              'notification_club_request_message',
              NotificationState.NEW,
              null,
              null,
              r,
            ),
          );
      }
    }
    return notifications;
  }
}
