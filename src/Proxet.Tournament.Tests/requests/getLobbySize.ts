import axios from "axios";

export const getLobbySize = async (url: string) : Promise<number> => {
  const response = await axios.get(`${url}/api/v1/lobby`);

  return response.data.size;
}
