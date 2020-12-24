import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch
} from "react-router-dom";

const Navbar = () => {
  const match = useRouteMatch()
    return (
          <div class="Navbar">
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to={`${match.url}/createGame`}>Create Game</Link>
                </li>
                <li>
                  <Link to="/users">Users</Link>
                </li>
                <li>
                    <span>Userinfo</span>
                </li>
              </ul>
            </nav>
          </div>
      );
}

export default Navbar