import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Notification from '../../classes/notification';
import { NotificationState } from '../../enums/notifications';
import { NotificationsProvider } from '../../interfaces/notifications';
import { Club, ClubDocument } from '../../schemas/club.schema';
import { User } from '../../schemas/user.schema';

@Injectable()
export class ClubsService implements NotificationsProvider {
  constructor(
    @InjectModel(Club.name) private readonly clubModel: Model<ClubDocument>,
  ) {}

  async addClub(club: Club): Promise<Club> {
    try {
      const createdClub = new this.clubModel(club);
      return createdClub.save();
    } catch {
      throw new BadRequestException({
        title: 'Error_adding_club',
        message: 'Cannot create club',
        payload: club,
      });
    }
  }

  async findAll(): Promise<Club[]> {
    return this.clubModel.find().exec();
  }

  async getClubById(id: string): Promise<Club> {
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return this.clubModel.findOne({ _id: id }).populate('players').lean();
    } else {
      throw new BadRequestException({
        title: 'Invalid_id',
        description: 'The_club_id_is_invalid_please_check_it',
        message: 'Club with id [' + id + '] not found',
      });
    }
  }

  async update(id: string, club: Club): Promise<Club> {
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
