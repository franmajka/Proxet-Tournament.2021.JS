import express from "express";
import bodyParser from "body-parser";
import mongodb from "mongodb";
const MongoClient = mongodb.MongoClient;
const MongoURI =
	"mongodb+srv://Anthony:pIfVzuAe786YkYeR@proxet.g3gf3.mongodb.net/players?retryWrites=true&w=majority";

const app = express();
const parser = bodyParser.json();
const port = 3000;

const areKeysEqual = (object1, object2) => {
	const keys1 = Object.keys(object1).sort();
	const keys2 = Object.keys(object2).sort();
	if (keys1.length !== keys2.length) {
		return false;
	}
	for (let i = 0; i < keys1.length; i++) {
		if (keys1[i] !== keys2[i]) {
			return false;
		}
	}
	return true;
};

app.get("/", (req, res) => {
	res.send("Server is working");
});

// Knock-knock! Is DB alive?
app.get("/api/v1/healthcheck", (APIrequest, APIresponse) => {
	MongoClient.connect(MongoURI, (DBerr, client) => {
		if (DBerr) {
			APIresponse.status(503);
			APIresponse.send("503 Service Unavailable");
			return;
		}

		const db = client.db("players");

		db.collection("players")
			.find()
			.sort({ _id: -1 })
			.toArray(function (err, result) {
				if (err) {
					APIresponse.status(503);
					APIresponse.send("503 Service Unavailable");
					return;
				}

				APIresponse.status(200);
				APIresponse.send("200 OK");

				client.close();
			});
	});
});

// Add a player to lobby
app.post("/api/v1/lobby", parser, (APIrequest, APIresponse) => {
	// We can't add players with wrong data format, can we?
	if (!areKeysEqual(APIrequest.body, { nickname: [], vehicleType: "" })) {
		APIresponse.status(503).send("Wrong player data");
		return;
	}
	MongoClient.connect(MongoURI, (clientErr, client) => {
		if (clientErr) {
			APIresponse.status(503);
			APIresponse.send("503 Service Unavailable");
			return;
		}

		const db = client.db("players");

		db.collection("players").insertOne(APIrequest.body, (DBerr, DBres) => {
			if (DBerr) {
				APIresponse.status(503);
				APIresponse.send("503 Service Unavailable");
				return;
			}

			APIresponse.sendStatus(200);
			client.close();
		});
	});
});

// Since players are "sorted" by wait times in ascending order,
// to generate teams we need to go from the end of the players array
// "collecting" all suitable players by vehicle types
const readyPlayers = { firstTeam: [[], [], []], secondTeam: [[], [], []] };
app.post("/api/v1/teams/generate", parser, (APIrequest, APIresponse) => {
	MongoClient.connect(MongoURI, (clientErr, client) => {
		if (clientErr) {
			APIresponse.status(503);
			APIresponse.send("503 Service Unavailable");
			return;
		}

		const db = client.db("players");

		// While I technically perform secondary sort by id, in reality I sort by time, as well
		// when a player was added in the database
		// MongoDB entries in collections have unique ids, which, in turn, contain timestamps
		// by which I basically sort players
		// Sort by ascending, so the earliest added players are the ones to be added into the game
		db.collection("players")
			.find()
			.sort({ vehicleType: 1, _id: 1 })
			.toArray((DBErr, DBRes) => {
				if (DBErr) {
					APIresponse.status(503);
					APIresponse.send("503 Service Unavailable");
					return;
				}

				const players = DBRes.map(({ nickname, vehicleType }) => {
					return { nickname, vehicleType };
				});

				for (let i = players.length - 1; i > 0; i--) {
					if (readyPlayers.firstTeam[+players[i].vehicleType - 1].length < 3) {
						readyPlayers.firstTeam[+players[i].vehicleType - 1].push(players[i]);
						continue;
					}
					if (readyPlayers.secondTeam[+players[i].vehicleType - 1].length < 3) {
						readyPlayers.secondTeam[+players[i].vehicleType - 1].push(players[i]);
						continue;
					}
					if (
						readyPlayers.firstTeam.flat().length === 9 &&
						readyPlayers.secondTeam.flat().length === 9
					)
						break;
				}

				readyPlayers.firstTeam = readyPlayers.firstTeam.flat();
				readyPlayers.secondTeam = readyPlayers.secondTeam.flat();
				for (const player of readyPlayers.firstTeam.concat(readyPlayers.secondTeam)) {
					db.collection("players").deleteOne({ nickname: player.nickname });
				}
				APIresponse.status(200);
				APIresponse.send(DBRes);
			});
	});
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
