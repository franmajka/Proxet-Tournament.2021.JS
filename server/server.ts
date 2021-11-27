import express from "express";
import asyncHandler from "express-async-handler";
import { Server } from "http";

import { getDB } from '../db/connectDB';
import { DB } from "../db/types";

import { clearLobby, startLobby, stopLobby } from "../src/Proxet.Tournament/lobby";

import { healthCheckHandler } from "./healthCheckHandler";
import { addPlayerHandler } from "./addPlayerHandler";
import { generateTeamsHandler } from "./generateTeamsHandler";
import { getLobbySizeHandler } from "./getLobbySizeHandler";
import { clearLobbyHandler } from "./clearLobbyHandler";

export const port = process.env.PORT || 3000;
export const url = process.env.URL || `127.0.0.1:${port}`;
export const app = express();
export let server: Server;

app.use(express.json());

app.get("/api/v1/healthcheck", asyncHandler(healthCheckHandler));

app.get("/api/v1/lobby", getLobbySizeHandler);
app.post("/api/v1/lobby", asyncHandler(addPlayerHandler));
app.delete("/api/v1/lobby", clearLobbyHandler);

app.post("/api/v1/teams/generate", asyncHandler(generateTeamsHandler));


export const startServer = (): Promise<void> => new Promise(resolve => {
  server = app.listen(port, () => {
    console.log("Server has been started...");
    resolve();
  })

  startLobby();

  server.on("close", () => {
    stopLobby();
  })
})

export const closeServer = (): Promise<void> => new Promise(resolve => {
  server.close(() => resolve());
})
