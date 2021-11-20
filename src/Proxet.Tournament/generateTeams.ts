import fs from "fs";

export interface Teams {
	team1: string[];
	team2: string[];
}

// Regular Math.max wouldn't work for two reasons:
// 1. There's much more players than JS's argument limit
// 2. It's not that easy to cherry-pick wait times from all the players
// and put them into a destructured argument
// In this function, player[1] is player's wait time
const myMax = (players: string[][]): number => {
	let max = Number.MIN_SAFE_INTEGER;
	for (const player of players) {
		if (+player[1] > max) {
			max = +player[1];
		}
	}
	return max;
};

/* 
  So, my plan here is to sort players by wait times, then go down from highest wait time
  picking players as long as there are places for their vehicle type
  This should be fast enough using Counting Sort, given how many players are there
  and how relatively small the wait times range is
*/
const countingSort = (players: string[][]): string[][] => {
	const n = players.length;

	const output: string[][] = new Array(n).fill([]);

	// Store how many wait time values from smallest to highest are there in an array
	let range = myMax(players);
	let count: number[] = new Array(range).fill(0);

	for (let i = 0; i < n; ++i) {
		++count[+players[i][1] - 1];
	}

	// Change count[i] so that count[i] now contains actual
	// position of this player in output array
	for (let i = 1; i <= range - 1; ++i) {
		count[i] += count[i - 1];
	}

	// Build the output players array
	for (let i = n - 1; i >= 0; i--) {
		output[count[+players[i][1] - 1] - 1] = players[i];
		--count[+players[i][1] - 1];
	}

	return output;
};

export const generateTeams = (filePath: string): Teams => {
	const fileLines = fs.readFileSync(filePath).toString().split(/\r?\n/).filter(Boolean);

	let lineCounter = 0;
	const players: string[][] = [];
	for (const line of fileLines) {
		if (++lineCounter == 1) {
			continue;
		}
		players.push(line.split("\t"));
	}
	const sortedPlayers = countingSort(players);

	const team1Grouped: string[][][] = [[], [], []];
	const team2Grouped: string[][][] = [[], [], []];

	for (let i = sortedPlayers.length - 1; i > 0; i--) {
		if (team1Grouped[+sortedPlayers[i][2] - 1].length < 3) {
			team1Grouped[+sortedPlayers[i][2] - 1].push(sortedPlayers[i]);
			continue;
		}
		if (team2Grouped[+sortedPlayers[i][2] - 1].length < 3) {
			team2Grouped[+sortedPlayers[i][2] - 1].push(sortedPlayers[i]);
			continue;
		}
		if (team1Grouped.flat().length === 9 && team2Grouped.flat().length === 9)
			break;
	}

	const team1: string[] = team1Grouped.flat().map((player) => player[0]);
	const team2: string[] = team2Grouped.flat().map((player) => player[0]);

	return {
		team1,
		team2,
	};
};
