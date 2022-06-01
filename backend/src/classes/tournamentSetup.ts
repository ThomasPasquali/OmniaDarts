import { Tournament } from 'src/schemas/tournaments.schema';
import { User } from 'src/schemas/user.schema';
import { shuffleArray } from 'src/utils/utils';

export default function setupTournament(tournament: Tournament): Tournament {
  const players = tournament.players;

  let rounds = chooseNumberGroups(players.length);
  let numRounds = rounds[0] + rounds[1];
  let round = 1;
  if (tournament.randomOrder) shuffleArray(players);

  // First round
  generateRounds(tournament, rounds[0], rounds[1], round++, players);

  // Next rounds
  /* do {
    rounds = chooseNumberGroups(numRounds);
    numRounds = rounds[0] + rounds[1];
    generateRounds(tournament, rounds[0], rounds[1], round++);
  } while (numRounds > 1); */

  return tournament;
}

function chooseNumberGroups(numPlayers: number): [number, number] {
  let numPairs = 0;
  let numTriplets = 0;
  if (numPlayers % 3 == 0) {
    numTriplets = numPlayers / 3;
  } else if ((numPlayers + 1) % 3 == 0) {
    numPairs = 1;
    numTriplets = (numPlayers - 2) / 3;
  } else {
    numPairs = 2;
    numTriplets = (numPlayers - 4) / 3;
  }
  return [numPairs, numTriplets];
}

function generateRounds(
  tournament: Tournament,
  numPairs: number,
  numTriplets: number,
  round: number,
  players: User[] = null,
) {
  let group = 1;
  // for (let i = 0; i < numTriplets; i++) {
  createRound(tournament, round, group++, players.splice(0, 3));
  // }
}
function createRound(
  tournament: Tournament,
  round: number,
  group: number,
  players: User[],
) {
  let results = players.map((p) => {
    p._id, 0;
  });
  console.log(results);
  /* let match = {
		dateTime: new Date(),
		players: players,
		done: false,
		gamemode: tournament.gamemode,
		winningMode: tournament.winningMode,
	} as Match; */
  /* let tournamentMatch = {
    tournamentRef: tournament,
    round: round,
    group: group,
    numPlayers: players.length,
    match: null,
  } as TournamentMatch; */
}
