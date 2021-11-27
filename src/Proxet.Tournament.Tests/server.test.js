const axios = require("axios");

describe("Server", () => {
	it("must add players", async () => {
		await axios
			.post("http://localhost:3000/api/v1/lobby", { nickname: "John", vehicleType: "1" })
			.then((response) => {
				expect(response.data).toEqual("OK");
			});
	});

	it("mustn't add players with invalid data format", async () => {
		await axios
			.post("http://localhost:3000/api/v1/lobby", {
				sampleKey: "eeeeeeeeeeeeee",
				aaaaa: "bbbbbb",
			})
			.catch((err) => {
				expect(err.response.data).toEqual("Wrong player data");
			});
	});

	it("must generate teams", async () => {
		await axios
			.post("http://localhost:3000/api/v1/teams/generate")
			.then((response) => {
				console.log(response.data);
				expect(response.data.firstTeam).toHaveLength(9);
				expect(response.data.secondTeam).toHaveLength(9);
			});
	});
});
