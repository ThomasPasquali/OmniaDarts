import { User } from '../schemas/user.schema';
import Notification from '../classes/notification';

export interface NotificationsProvider {
  getNotifications(user: User): Promise<Notification[]>;
}
