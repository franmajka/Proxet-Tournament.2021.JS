import { Request, Response } from "express"

import { clearLobby } from "../src/Proxet.Tournament/lobby";

export const clearLobbyHandler = (req: Request, res: Response) => {
  clearLobby();

  res.status(200).send();
}
