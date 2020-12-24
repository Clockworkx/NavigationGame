import Navbar from './Navbar'
import gameService from '../services/GameService'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory
  } from "react-router-dom";



const { useState } = require("react")
const {socket} = require('../services/socket')


const CreateGame = () => {
    let history = useHistory();
    const gameOptions = {
        gamemode: 'famous places',
        time: 300,
        gameLeader: 'Playername'
    }

    const handleCreateGame = (event) => {
        event.preventDefault()
        socket.emit('CMCreateGame', gameOptions)
        gameService.createGame(gameOptions).then(response => {
            console.log(response)
            const gameId = response.gameId
            history.push(`game/${gameId}`)
        })
        .catch(error => console.log(error))


    }
    return (
        <div>
            <Navbar/>
            <p>Game Host: "Player x" </p>
                <button onClick={handleCreateGame}>Create Game Now</button>
        </div>
    )
}

export default CreateGame