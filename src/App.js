import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CreateGame from "./components/CreateGame";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import GameHome from "./components/GameHome";
import "./index.css";

const App = () => {
  return (
    <Router>
      <div className="navbar">
        <h1>GeoBesser</h1>
        <ul className="navbar-list">
          <li>
            <Link to="/game">Game</Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </div>

      <Switch>
        <Route path="/users">
          <h1>rendered Users</h1>
        </Route>
        <Route path="/game">
          <GameHome />
        </Route>
        <Route path="/">
          <div className="home render">
            <h1>Home render</h1>
          </div>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
