import { User } from '../schemas/user.schema';

export default class Lobby {
    owner: User;
    isPublic: boolean = true;
}