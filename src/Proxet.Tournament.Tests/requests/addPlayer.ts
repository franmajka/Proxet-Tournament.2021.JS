import axios from "axios";
import { Player } from "../../../server/types";

export const addPlayer = async (url: string, player: Player) : Promise<number> => {
  const response = await axios.post(`${url}/api/v1/lobby`, player);

  return response.status;
}
