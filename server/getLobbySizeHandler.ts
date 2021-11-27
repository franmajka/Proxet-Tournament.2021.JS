import { Request, Response } from "express"

import { lobby } from "../src/Proxet.Tournament/lobby";

export const getLobbySizeHandler = (req: Request, res: Response) => {
  let size = 0;
  for (const queue of lobby) {
    size += queue.length;
  }

  res.status(200).send(JSON.stringify({
    size
  }));
}
