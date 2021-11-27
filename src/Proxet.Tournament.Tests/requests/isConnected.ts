import axios from "axios";

export const isConnectedRequest = async (url: string) : Promise<number> => {
  const response = await axios.get(`${url}/api/v1/healthcheck`);

  return response.status;
}
