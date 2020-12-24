import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import CreateGame from './components/CreateGame'
import Navbar from './components/Navbar'
import Home from './components/Home'
import GameHome from './components/GameHome'

const App = () => {
  return (
    <Router>
      <div>
        <ul>
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

        <Switch>
          <Route path="/users">
          <h1>rendered Users</h1>
          </Route>
          <Route path="/game">
            <GameHome/>
          </Route>
          <Route path="/">
            <h1>Home render</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App