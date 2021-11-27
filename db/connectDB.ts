import { resolve } from "path";
import { readFile } from 'fs/promises'

import Datastore from "nedb";

import { DB, Config } from "./types";
import { Entries } from "../utils/Entries";

const db: DB = {};
let connected = false;

const connectDataStore = async <T> (path: string): Promise<Datastore<T>> => {
  const dataStore: Datastore<T> = new Datastore({
    filename: path
  });

  return new Promise((resolve, reject) => dataStore.loadDatabase(err => {
    if (!err) resolve(dataStore);
    reject(err);
  }));
}

export const connectDB = async () : Promise<DB> => {
  const jsonBuf = await readFile(resolve(process.env.NODE_PATH as string, "db/config.json"));
  const config: Config = JSON.parse(jsonBuf.toString('utf-8'));

  // Here should be some exception handlers...
  await Promise.all(
    (Object.entries(config) as Entries<Config>).map(
      async ([name, path]) : Promise<void> => {
        db[name] = await connectDataStore<DB[keyof DB]>(path)
      }
    )
  );

  connected = true;
  return db;
}

export const getDB = async () => connected ? db : connectDB();
