import Throw from "./throw";

export default class PlayerThrows {

    public playerThrows: any = {};

    constructor(
        private readonly userID: string,
    ) {
    }

    public playerIs(id: string): boolean {
        return this.userID === id;
    }
}

export function playerThrowsAddThrow(playerThrows: PlayerThrows, newThrow: Throw): void {
    const setLeg = newThrow.legSet;
    !playerThrows.playerThrows[setLeg] && (playerThrows.playerThrows[setLeg] = []);
    playerThrows.playerThrows[setLeg].push(newThrow);
}