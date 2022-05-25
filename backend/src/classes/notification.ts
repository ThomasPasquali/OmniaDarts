import { NotificationsGateway } from '../modules/notifications/notifications.gateway';
import { NotificationAction, NotificationState } from '../enums/notifications';
import { User } from '../schemas/user.schema';

export default class Notification {
  public static idCount = 0;
  private readonly _id: number;

  constructor(
    public title: string,
    public message: string,
    public state: NotificationState | null = null,
    public action: NotificationAction = null,
    public sender: User = null,
    public payload: any = null,
  ) {
    this._id = Notification.idCount++;
  }

  get id(): number {
    return this._id;
  }
}
