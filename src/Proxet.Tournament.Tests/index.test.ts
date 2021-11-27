import { isConnectedRequest } from './requests/isConnected'
import { addPlayer } from './requests/addPlayer';
import { getLobbySize } from './requests/getLobbySize';
import { clearLobby } from './requests/clearLobby';
import { generateTeams } from './requests/generateTeams';

const URL = 'http://localhost:3000';


describe('TournamentTests', () => {
  it('DB connected', async () => {
    const statusCode = await isConnectedRequest(URL);
    expect(statusCode).toBe(200);
  });

  it('Add player to lobby', async () => {
    await clearLobby(URL);

    expect(await addPlayer(URL, {
      name: "test",
      vehicleClass: 1
    })).toBe(201);

    expect(await getLobbySize(URL)).toBe(1);
  });

  it('Try to generate team with not enough players', async () => {
    expect((await generateTeams(URL)).status).toBe(204);
  });

  it('Add some players', async () => {
    await clearLobby(URL);
    const nPlayers = 10;

    for (let i = 0; i < nPlayers; i++) {
      expect(await addPlayer(URL, {
        name: `${i}`,
        vehicleClass: Math.floor(Math.random() * 3) + 1
      })).toBe(201);
    }

    expect(await getLobbySize(URL)).toBe(nPlayers);
  });

  it('Generate teams', async () => {
    await clearLobby(URL);

    for (let vehicleClass = 1; vehicleClass <= 3; vehicleClass++) {
      for (let i = 0; i < 6; i++) {
        expect(await addPlayer(URL, {
          name: `${vehicleClass}${i}`,
          vehicleClass
        })).toBe(201);
      }
    }

    expect(await getLobbySize(URL)).toBe(18);

    expect((await generateTeams(URL)).status).toBe(200);

    expect(await getLobbySize(URL)).toBe(0);
  });

  
});
