import { Match } from '../schemas/match.schema';
import { User } from '../schemas/user.schema';

export default abstract class SpecificMatch extends Match {
  abstract getWinner(): User;
  abstract getScores(): any;
  abstract isDone(): boolean;
}
