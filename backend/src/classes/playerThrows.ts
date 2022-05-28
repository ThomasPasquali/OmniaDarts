import Throw from "./throw";

export default class PlayerThrows {

    public playerThrows: any = {};

    constructor(
        private readonly userID: string,
    ) {
    }

    public addThrow(setLeg: string, newThrow: Throw): void {
        !this.playerThrows[setLeg] && (this.playerThrows[setLeg] = []);
        this.playerThrows[setLeg].push(newThrow);
    }

    public playerIs(id: string): boolean {
        return this.userID === id;
    }
}