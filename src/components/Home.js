import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div class="home">
      {/* <Navbar /> */}

      <p>Select gamemode, play with friends, solo, </p>
      <p>Vorgestellte gamemodi</p>
      <p>Leaderboards / some stats</p>
      <p>sidebar</p>
    </div>
  );
};

export default Home;
