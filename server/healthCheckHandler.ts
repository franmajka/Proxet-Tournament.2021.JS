import { getDB } from "../db/connectDB";
import { DB } from "../db/types";
import { Request, Response } from "express"


export const healthCheckHandler = async (req: Request, res: Response) => {
  const db = await getDB();
  let isConnected = !!db;

  if (isConnected) {
    const promises: Promise<void>[] = [];
    for (const ds of <DB[keyof DB][]>Object.values(db)) {
      if (!ds) {
        isConnected = false;
        break;
      }

      promises.push(new Promise(resolve => ds.findOne({}, err => {
        if (isConnected && err) isConnected = false;
        resolve();
      })));
    }

    await Promise.all(promises);
  }

  res.status(isConnected ? 200 : 503).send();
}
