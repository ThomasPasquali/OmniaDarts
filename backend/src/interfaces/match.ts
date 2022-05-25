import {User} from "../schemas/user.schema";

export interface SpecificMatch {
    getWinner(): User;
    getScores(): any;
    isDone(): boolean;
}

export abstract class MatchSettings {

}