import {User} from "../schemas/user.schema";

export default interface SpecificMatch {
    getWinner(): User;
    getScores(): any;
    isDone(): boolean;
}