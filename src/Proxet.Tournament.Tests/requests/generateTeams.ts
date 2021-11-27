import axios, { AxiosResponse } from "axios";

export const generateTeams = async (url: string) : Promise<AxiosResponse> => {
  const response = await axios.post(`${url}/api/v1/teams/generate`);

  return response;
}
