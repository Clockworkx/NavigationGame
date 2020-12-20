import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const Navbar = () => {
    return (
          <div class="Navbar">
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/createGame">Create Game</Link>
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
function About() {
    return <h2>About</h2>;
  }
  
  function Users() {
    return <h2>Users</h2>;
  }
  
  function Home() {
    return <h2>Home</h2>;
  }

export default Navbar