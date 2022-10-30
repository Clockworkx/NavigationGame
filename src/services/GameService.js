import axios from "axios";
const baseUrl = "/api";

const getGames = () => {
  const request = axios.get(`${baseUrl}/games`);
  return request.then((response) => response.data);
};

const createGame = (newObject) => {
  const request = axios.post(`${baseUrl}/game/`, newObject);
  return request.then((response) => response.data);
};

const update = (id, newObject) => {
  const request = axios.patch(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default {
  getGames,
  createGame,
  update,
};
