import { User } from '../schemas/user.schema';

export default class Lobby {
  owner: User;
  isPublic = true;
  chatID: string;
  joinRequests: User[] = [];

  constructor(lobby) {
    this.isPublic = lobby && lobby.isPublic !== undefined && lobby.isPublic;
  }
}
