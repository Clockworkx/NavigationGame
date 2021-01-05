import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import Navbar from './Navbar'

const { useState, useEffect } = require("react")
const { socket } = require('../services/socket')

//try it this way if it doesn't work you might need to look at react contexts/redux depending on what you prefer
const GameLobby = ({setIsGameStarted, player, setPlayer, locations, setLocations}) => {
  useEffect(() => {
    socket.on('testReceived', (test) => {
      setPlayers(players => [...players, test])
      console.log('testvontestreceived', test)
    })
    socket.on('SMPlayerConfirmSetName', (playerName) => {
     // console.log('received')
      setPlayer({ ...player, name: playerName })
      console.log('called setplayer')
    })
    socket.on('SMPlayerDenySetName', (reason) => alert(reason))
    socket.on('SMGamePlayerJoin', (players) => {
      console.log('playerjoin')
      console.log('players', players)
      
      setPlayers(players) //previousPlayers => previousPlayers.concat(player)
    })
    socket.on('SMPlayerConfirmReady', (sPlayer) => {
      setPlayers(previousPlayers => {
        console.log('test',previousPlayers.map(player =>
          player.name === sPlayer.name 
          ? sPlayer
          : player))
        return previousPlayers.map(player =>
          player.name === sPlayer.name 
          ? sPlayer
          : player)
          
      })
    })
    socket.on('SMChangeLobbyPlayerState', (newPlayerState) => {

      setPlayers(prevPlayers =>  {
        return prevPlayers.map(player => 
          player.name === newPlayerState.name
          ? newPlayerState
          : player
        )
      })
    })
    socket.on('SMStartGameDecline', (reason) => {
      setNotification({message: reason, style: 'error'})
      setTimeout(() => setNotification({message: null}), 3000)

    })
    socket.on('SMStartGameAccept', (gameId, locations) => {
      setLocations(locations)
      history.push(`/game/${gameId}`)
    })
    
    
    return () => {
      socket.offAny(() => console.log('off any'))
    }
  }, [])


  const [nameInput, setNameInput] = useState('')
  //const [player, setPlayer] = useState({name: null, ready: false})
  const [players, setPlayers] = useState([{name: 'defaultPlayer', ready: false}])
  const [teststate, setTeststate] = useState(false)
  const [notification, setNotification] = useState({message: null, style: null})
  

  const {gameId} = useParams()
  const history = useHistory();
  const match = useRouteMatch() 
  console.log(gameId)
console.log('hsitoryasd', history)
  // send playername upon loading the site
  const handleStartGame = () => {
    console.log('Start game button function')
    socket.emit('CMStartGameRequest', gameId, players)
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
      <button onClick={() => socket.emit('test', 'testvon button')}>test emit</button>
      <p>{teststate ? 'true' : 'false'}</p>
      <Notification notificationDetails={notification}/>
    </div>
  )
}


const Notification = ({notificationDetails}) => {
  console.log(notificationDetails)
  const error = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const success = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  if (notificationDetails.message === null) return null
  let style = undefined

  if (notificationDetails.style === 'success')
  style = success

  if (notificationDetails.style === 'error')
  style = error

  return (
    <div style={style}>
      {notificationDetails.message}
    </div>
  )
}

export default GameLobby