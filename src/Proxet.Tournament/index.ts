import { generateTeams } from "./generateTeams";

const logTeam = (teamName: string, players: string[]) => {
  console.log(`Team ${teamName}:`);
  players.forEach((player) => {
    console.log(player);
  });
}

const teams = generateTeams("./wait-time.stat");

logTeam("Red", teams.team1);
logTeam("Blue", teams.team2);
console.log("Work is done");