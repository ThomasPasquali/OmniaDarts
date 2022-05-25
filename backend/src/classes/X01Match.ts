import SpecificMatch from '../interfaces/match';
import { Match } from '../schemas/match.schema';
import { User } from '../schemas/user.schema';

export default class X01Match extends SpecificMatch {
  getScores(): any {
    return {
      playerID1: 12,
      playerID2: 9,
      playerID3: 1,
    };
  }

  getWinner(): User {
    return this.players[0];
  }

  isDone(): boolean {
    return true;
  }
}
