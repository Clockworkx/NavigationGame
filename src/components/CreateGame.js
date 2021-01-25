import gameService from "../services/GameService";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from "react-router-dom";

const { useState } = require("react");
const { socket } = require("../services/socket");

const CreateGame = ({ setLocations }) => {
  let history = useHistory();
  console.log("asd", history);
  const gameOptions = {
    gamemode: "famous places",
    time: 300,
    gameLeader: "Playername",
    players: [],
    estimates: [],
  };

  const handleCreateGame = (event) => {
    event.preventDefault();
    socket.emit("CMCreateGame", gameOptions);
    console.log("work?");
    gameService
      .createGame(gameOptions)
      .then((response) => {
        const locations = response.locations;
        setLocations(locations);
        const gameId = response.gameId;
        history.push(`${gameId}/lobby`);
      })
      .catch((error) => console.log("yes error", error));
  };
  return (
    <div>
      <p>Game Host: Test</p>
      <button className="button" onClick={handleCreateGame}>
        Create Game Now
      </button>
    </div>
  );
};

export default CreateGame;
