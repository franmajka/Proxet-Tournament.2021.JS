import { Request, Response } from "express"

import { lobby } from "../src/Proxet.Tournament/lobby";
import { Player } from "./types";

const checkPlayer = (player: Player) => {
  // Some validation...
  return true;
}

export const addPlayerHandler = async (req: Request<{}, {}, Player>, res: Response) => {
  if (!checkPlayer(req.body)) {
    // Not valid
    res.status(400).send();
  }

  lobby[req.body.vehicleClass - 1].push({
    name: req.body.name,
    waitTime: 0
  })

  // Created
  res.status(201).send();
}
