/**
 * In the real project I'd rather use some kinda priorityqueue.js
 * or other already made solution but it's the test case so I wrote one myself
 */
import { VehicleClassType } from "../../db/types";
import { PriorityQueue, CompareFunc } from "./PriorityQueue";

const VEHICLE_CLASSES = 3;
const SAME_VEHICLES_PER_TEAM = 3;
const TEAMS = 2;


export const NotEnoughPlayers = new Error("Not enough players");


export type PlayerQueue = PriorityQueue<PlayerInQueue>;

export type PlayerInTeam = {
  nickname: string,
  vehicleClass: VehicleClassType
}
export type Team = PlayerInTeam[];
export type Teams = Team[];

export interface PlayerInQueue {
  name: string,
  waitTime: number,
}

// Players with the most waitTime will be the first in a queue
const compare: CompareFunc<PlayerInQueue> = (left, right) => {
  return left.waitTime > right.waitTime;
}

// ====================

// For every vehicle class there is a separate queue
// If VehicleClassType is not number it can be changed to Map
export let lobby: PlayerQueue[]
let interval: NodeJS.Timer;

export const startLobby = () => {
  lobby = new Array(VEHICLE_CLASSES);
  for (let i = 0; i < lobby.length; i++) {
    lobby[i] = new PriorityQueue<PlayerInQueue>({ compare });
  };

  interval = setInterval(() => {
    for (const queue of lobby) {
      for (const player of queue) {
        player.waitTime++;
      }
    }
  }, 1 * 1000);
}

export const clearLobby = () => {
  for (const queue of lobby) {
    queue.clear();
  }
}
export const stopLobby = () => clearInterval(interval);

// ====================

const restoreQueue = (removedPlayers: PlayerInQueue[][]) => {
  for (let i = 0; i < removedPlayers.length; i++) {
    for (const player of removedPlayers[i]) {
      lobby[i].push(player);
    }
  }
}

export const generateTeams = () : Teams => {
  const teams: Teams = new Array(TEAMS).fill([]);

  // If there was not enough players in queue we'll restore data from the array
  const removedPlayers: PlayerInQueue[][] = new Array(VEHICLE_CLASSES).fill([]);

  // For every team adding 3 vehicles per vehicle class
  for (let i = 0; i < TEAMS; i++) {
    for (let j = 0; j < VEHICLE_CLASSES; j++) {
      for (let k = 0; k < SAME_VEHICLES_PER_TEAM; k++) {
        if (lobby[j].isEmpty) {
          restoreQueue(removedPlayers);
          throw NotEnoughPlayers;
        }

        const player = lobby[j].pop();
        removedPlayers[j].push(player);
        teams[i].push({
          nickname: player.name,
          vehicleClass: j
        });
      }
    }
  }

  return teams;
};
