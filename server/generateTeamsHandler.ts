import { Request, Response } from "express"
import { generateTeams, NotEnoughPlayers } from "../src/Proxet.Tournament/lobby"

export const generateTeamsHandler = async (req: Request, res: Response<string>) => {
  try {
    const [firstTeam, secondTeam] = generateTeams();

    res.status(200).send(JSON.stringify({
      firstTeam,
      secondTeam
    }));
  } catch (e) {
    switch (e) {
      case NotEnoughPlayers:
        res.status(204).send();
        break;

      default:
        throw e;
    }
  }
}
