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
    console.log('asd', history)
    const gameOptions = {
        gamemode: 'famous places',
        time: 300,
        gameLeader: 'Playername',
        players: []
    }

    const handleCreateGame = (event) => {
        event.preventDefault()
        socket.emit('CMCreateGame', gameOptions)
        gameService.createGame(gameOptions).then(response => {
            console.log(response)
            const gameId = response.gameId
            history.push(`${gameId}/lobby`)
        })
        .catch(error => console.log(error))


    }
    return (
        <div>
            <p>Game Host: Test</p>
                <button onClick={handleCreateGame}>Create Game Now</button>
        </div>
    )
}

export default CreateGame