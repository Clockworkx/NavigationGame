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

const App = () => {
    return (
          <div className="Home">
                          
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/createGame">
                <CreateGame />
              </Route>
              <Route path="/users">
                <Home />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
          </div>
      );
}

export default App