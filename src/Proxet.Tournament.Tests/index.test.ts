import fs from 'fs';

import { generateTeams } from '../Proxet.Tournament/generateTeams';

import { class1Users, class2Users, class3Users } from './bestPlayers';

describe('TournamentTests', () => {
  const filePath = './src/Proxet.Tournament/wait-time.stat';

  it('should stat file exist', async () => {
    expect(fs.existsSync('./src/Proxet.Tournament/wait-time.stat')).toBe(true);
  });

  it('should generate ideal teams', async () => {
    // In general it's not right to change tests to fit your code
    // but it'll be much harder to not use async / await syntax
    // Also I have no idea why the test func should be async if
    // there is no code that uses promises
    const teams = await generateTeams(filePath);

    // Should have 9 players in both teams
    expect(teams.team1).toHaveLength(9);
    expect(teams.team2).toHaveLength(9);

    // Should not have the same player in both teams
    expect(teams.team1.every(player => !teams.team2.includes(player))).toBe(true);

    // Teams should each contain 3 players with most wait time of every vehicle class
    const assertClass = (bestPlayers: string[]) => {
      expect(teams.team1.filter(player => bestPlayers.includes(player))).toHaveLength(3);
      expect(teams.team2.filter(player => bestPlayers.includes(player))).toHaveLength(3);
    }
    assertClass(class1Users);
    assertClass(class2Users);
    assertClass(class3Users);
  });
});
