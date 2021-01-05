// import { Rnd } from 'react-rnd'
// import { useState } from 'react'
import React from 'react'
import '../index.css';
import { Map, StreetView } from './GoogleMaps'
// import GameInfo from './components/GameInfo'
import Timer from './Timer'
import { useState, useRef, useEffect } from 'react'
import { socket } from '../services/socket'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import CreateGame from './CreateGame'
import GameLobby from "./GameLobby";
import './comp.css'
//team mode

const Round = ({ setGameStatus, location, player, round, gameId}) => {
  const [timerState, setTimerState] = useState(null)
  const [marker, setMarker] = useState(null)
  const [isStreetViewRendered, setIsStreetViewRendered] = useState(false)
  

  //console.log('timerState', timerState)

  if (timerState === 0) {
    console.log('called cmfinishRound')
    socket.emit('CMFinishRound', gameId, player.name, round )
    setGameStatus("isPostRoundDisplay")
    return null
  }

  const SubmitGuess = () => {
    
  }

  return (
    <div className="Container">
      <StreetView location={location} setIsStreetViewRendered={setIsStreetViewRendered}/>
      <Map location={location} marker={marker} setMarker={setMarker} player={player} round={round} gameId={gameId} mapOptions={'midgameResults'}/>
      <button onClick={() => {
        console.log('called button submitguess')
        socket.emit('CMSubmitGuess', player, marker, round)}}>test</button>
      <GameInfo setTimerState={setTimerState} isStreetViewRendered={isStreetViewRendered} />
    </div>
  )
}
const InterimResults = ({ round, setRound, setGameStatus, results }) => {
  console.log('anka', results)
  const resultsArray = null
  if (results) resultsArray = Object.entries(results)
  const handleNextRound = () => {
    if (round < 5) {
      setGameStatus("isInRound")
      setRound(previousState => previousState + 1)
    }

    if (round === 4) {
      setGameStatus("isGameOver")
      return <> </>
    }

  }

  return (
    //  <div>
    // //   {results 
    // //   ? <ul>
    // //     {resultsArray.map(result => <li>result</li>)}
    // //   </ul>
    // //   : 'No results received'
    // //  }
    //   <button onClick={handleNextRound}>Next round</button>
    // </div>
    null
  )

}

const Results = ({playerResult}) => {
  return (
    <li> `${playerResult}`</li>
  )
}

const MidgameResults = ({ round, setRound, setGameStatus, location, player, gameId}) => {
  const [guessMarkers, setGuessMarkers] = useState(null)
  const [results, setResults] = useState(null)

  console.log('asd', location)
  useEffect(() => {
    socket.emit('CMGetGuessPositions', player, round, gameId)
    socket.emit('CMGetMidgameResults', gameId, round)
    socket.on('SMSendGuessPositions', (guessPositions) => {
      console.log('asdmarkers', Object.values(guessPositions))
      setGuessMarkers(guessPositions)
    })
    socket.on('SMSendMidgameResults', (results) => {
      console.log('SMSendMidgameResults', results)
      setResults(results)
    })

    return () => {
      socket.offAny(() => console.log('off any'))
    }
  },[])

  console.log('guessmarkers,', guessMarkers)
  return (
    
    <div className="midgameResults">
      {console.log('results von midgam rresults', results)}
      <Map location={location} guessMarkers={guessMarkers}/>
      {!guessMarkers
      ? <div>Calculating stats</div>
      : null
    }
      <InterimResults round={round} setRound={setRound} setGameStatus={setGameStatus} results={results} />
    </div>
  )
}

const Game = ({ locations, player }) => {
  const {gameId} = useParams()
  const [gameStatus, setGameStatus] = useState("isInRound")
  const [round, setRound] = useState(0)

  console.log('locations in game', locations)
  switch (gameStatus) {
    case "isInRound":
      return (
        <Round setGameStatus={setGameStatus} location={locations[round]} player={player} round={round} gameId={gameId}/>
      )
      break;
    case "isPostRoundDisplay":
      return (
        <MidgameResults round={round} setRound={setRound} setGameStatus={setGameStatus} location={locations[round]} player={player.name} gameId={gameId}/>
      )
      break;
    case "isGameOver":
      return (
        <GameOverResults />
      )
      break;

    default:
      return (
        <div>Something went wrong</div>
      )
      break;
  }
}

const GameOverResults = () => {
  return (
    <div>Game Over</div>
  )
}

const InfoDisplay = () => {
  return (
    <div className="infoDisplay">
      {/* mouse click position {coords} */}
        lorem ipsum
      {/* <div>
          <button onClick={() => setDragging(!dragging)}>disable drag</button>
        </div> */}
    </div>
  )

}

const GameInfo = ({ timerState, setTimerState, formatted, isStreetViewRendered}) => {
  const [timer2, stimer2] = useState(null)

  if (!isStreetViewRendered) { 
    return (
    <div className="gameInfo">
      {console.log('not rendered', new Date().toISOString())}NOT RENDERED</div>
  )
  }
  return (
    <div className="gameInfo">
      {console.log('rendreerd at', new Date().toISOString())}
      <Timer setTimerState={setTimerState} />
            round ,
    </div>
  )
}

// const Navbar = () => {

//   const [inviteReceived, setinviteReceived] = useState(false)
//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('connected')
//     })
//     socket.on('disconnect', () => {
//       console.log('disconnected')
//     })
//     socket.on('SMConnectionReceived', (arg) => console.log(arg))
//     socket.on('locations_send', (locations) => {
//       console.log('loca', locations)

//     })
//     console.log('hi')
//     return () => {
//       socket.offAny(() => console.log('off any'))
//       console.log('cleanup')
//     }
//   }, [])
//   return (
//     <div className="navbar" > <h1>Professor Geo {" "} <span role="img" aria-label="geo">🐱‍🏍</span></h1>
//     {/* <Search /> */}
//     <button onClick={() => {socket.emit('location_request', ['test'])}}>get random map</button>
//     {inviteReceived ? "pending invite" : "no pending invite"}
//     <button onClick={(params) => {
//       socket.emit('CMCreateGame')

//     }}>Create New Game</button>
//     </div>
//   )
// }


export default Game