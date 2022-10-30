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

const GameBrowser = () => {
  const [games, setGames] = useState("no games");

  gameService
    .getGames()
    .then((games) => {
      setGames(games);
    })
    .catch((error) => console.log("error in gamebrowser", error));

  return <div dangerouslySetInnerHTML={games}></div>;
};

export default GameBrowser;
