import { useParams } from 'react-router-dom'
import Navbar from './Navbar'

const { useState, useEffect } = require("react")
const { socket } = require('../services/socket')

//try it this way if it doesn't work you might need to look at react contexts/redux depending on what you prefer
const GameLobby = () => {
  useEffect(() => {
    socket.on('SMPlayerConfirmSetName', (playerName) => {
     // console.log('received')
      setPlayer({ ...player, name: playerName })
      console.log('called setplayer')
    })
    socket.on('SMPlayerDenySetName', (reason) => alert(reason))
    socket.on('SMGamePlayerJoin', (playerName) => {
      console.log('playerjoin')
      console.log('players', players)
      
      setPlayers(previousPlayers => previousPlayers.concat({name: playerName, ready: false}))
    })
    socket.on('SMPlayerConfirmReady', (player) => {

      setPlayers(previousPlayers => previousPlayers.concat(player))
    })
    
    return () => {
      socket.offAny(() => console.log('off any'))
    }
  }, [])


  const [nameInput, setNameInput] = useState('')
  const [player, setPlayer] = useState({name: null, ready: false})
  const [players, setPlayers] = useState([])

  const {gameId} = useParams()
  console.log(gameId)

  // send playername upon loading the site
  const handleStartGame = () => {
    console.log('Start game button function')
  }

  const handleReady = () => {
    socket.emit('CMPlayerReady', player, gameId)

  }

  const handleNameSubmit = (event) => {
    event.preventDefault()
    socket.emit('CMPlayerSetName', nameInput, gameId)
  }

  const handleNameInputChange = (event) => setNameInput(event.target.value)

  
  console.log(players)

  return (
    <div>
      <h1>Game Lobby</h1>
      <ul>
        {players.map(player => <li key={player.name}>{`${player.name} ${player.ready ? 'Ready' : 'NOT ready'}`}</li>)}
      </ul>
      <button onClick={handleReady}>Ready Up</button>
      <button onClick={handleStartGame}>Start Game</button>

      <form onSubmit={handleNameSubmit}>
        <label>
          Player Name:
          <input type="text" value={nameInput} onChange={handleNameInputChange} />
        </label>
        <input type="submit" value="Set Name" />
      </form>

      <p>Your Name {player.name ? player.name : 'not set'} </p>



    </div>
  )

}

export default GameLobby