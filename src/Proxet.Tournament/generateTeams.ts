/**
 * In the real project I'd rather use some kinda priorityqueue.js
 * or other already made solution but it's the test case so I wrote one myself
 */
import { PriorityQueue, CompareFunc } from "./PriorityQueue";

import { createReadStream } from "fs";
import { createInterface } from "readline";

const VEHICLE_CLASSES = 3;
const SAME_VEHICLES_PER_TEAM = 3;
const TEAMS = 2;

/**
 * I guess in real life queue wont look like an unordered file
 * but if it will you can always pick not all players but only
 * a part of them so you will optimize team generation process
 */
const MAX_PLAYERS_IN_QUEUE = Infinity;

// Why is it not red and blue teams or simply two-dimensional array of players...
export interface Teams {
  team1: string[];
  team2: string[];
}

export interface PlayerInQueue {
  name: string,
  waitTime: number,
}

export type PlayerQueue = PriorityQueue<PlayerInQueue>;

const readQueueFile = async (filePath: string) : Promise<PlayerQueue[]> => {
  // Players with the most waitTime will be the first in a queue
  const compare: CompareFunc<PlayerInQueue> = (left, right) => {
    return left.waitTime > right.waitTime;
  }

  const queues: PlayerQueue[] = new Array(VEHICLE_CLASSES);
  for (let i = 0; i < queues.length; i++) {
    queues[i] = new PriorityQueue<PlayerInQueue>({ compare });
  }

  const fileStream = createReadStream(filePath);
  const readLineInterface = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  // Skipping first line
  let linesIterator = readLineInterface[Symbol.asyncIterator]();
  await linesIterator.next();

  let counter = 0;
  for await (const line of linesIterator) {
    const [name, waitTime, vehicleClass] = line.split("\t");
    queues[+vehicleClass - 1].push({
      name,
      waitTime: +waitTime,
    })

    if (++counter > MAX_PLAYERS_IN_QUEUE) break;
  }

  return queues;
}

export const generateTeams = async (filePath: string) : Promise<Teams> => {
  // For every vehicle class there is a separate queue
  const queues = await readQueueFile(filePath);

  const teams: Teams = {
    team1: [],
    team2: [],
  };

  // For every team adding 3 vehicles per vehicle class
  for (let i = 0; i < TEAMS; i++) {
    for (let j = 0; j < VEHICLE_CLASSES; j++) {
      for (let k = 0; k < SAME_VEHICLES_PER_TEAM; k++) {
        const player = queues[j].pop();
        teams[`team${i + 1}` as keyof Teams].push(player.name);
      }
    }
  }

  return teams;
};
