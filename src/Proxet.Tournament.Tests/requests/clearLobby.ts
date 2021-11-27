import axios from "axios";

export const clearLobby = async (url: string) : Promise<number> => {
  const response = await axios.delete(`${url}/api/v1/lobby`);

  return response.status;
}
