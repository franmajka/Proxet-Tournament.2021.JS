import { getDB } from "../../db/connectDB";
import { PlayerInDB } from "../../db/types";
import { resolve } from "path";

import { startServer } from "../../server/server";
import { PriorityQueue } from "./PriorityQueue";

(async () => {
  console.log("Start");

  // I don't really know how should I use db so it simply exists...
  const db = await getDB();
  console.log("DB connected");



  await startServer();


})()
