// import { Rnd } from 'react-rnd'
// import { useState } from 'react'
import React from 'react'
import '../index.css';
import {Map, StreetView} from './GoogleMaps'
// import CurrentGameInfo from './components/CurrentGameInfo'
import Timer from './Timer'
import { useState, useRef, useEffect } from 'react'
import {socket} from '../services/socket'
import {BrowserRouter as Router,
  Switch,
  Route,
  Link} from 'react-router-dom'


// const center = {
//   lat: 51.165691,
//   lng: 10.451526
// }

const Round = ({setGameStatus}) => {
  const [ timerState, setTimerState ] = useState(null)
  console.log('timerState', timerState)

  if (timerState === 0) {
    setGameStatus("isPostRoundDisplay")
    return <> </>
  }

  return (
    <div className="Container">
      <Navbar />
      <StreetView />
      <Map />
      <CurrentGameInfo setTimerState={setTimerState}/>
    </div>
  )
}
const Game = () => {
  const [gameStatus, setGameStatus] = useState("isInRound")
  const [currentRound, setCurrentRound] = useState(1)


  switch (gameStatus) {
    case "isInRound":
      return (
        <Round setGameStatus={setGameStatus} />
      )
      break;
    case "isPostRoundDisplay":
        return (
          <MidgameResults currentRound={currentRound} setCurrentRound={setCurrentRound} setGameStatus={setGameStatus}/>
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

const CurrentGameInfo = ({timerState, setTimerState, formatted}) => {
    const [isGameStarted, setIsGameStarted] = useState(false)

    const handleStartGame = (event) => {
        console.log(event)
        setIsGameStarted(!isGameStarted)

    }
    if (isGameStarted){
      return (
        <div>
            <Timer setTimerState={setTimerState}/>    
            Round , 
        </div>
    )
    
    }
    else return (
      <div>Waiting for Host to start game
          <button onClick={handleStartGame}>Start Game</button>
      </div>
      )
}

const Navbar = () => {

  const [inviteReceived, setinviteReceived] = useState(false)
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
    })
    socket.on('disconnect', () => {
      console.log('disconnected')
    })
    socket.on('SMConnectionReceived', (arg) => console.log(arg))
    socket.on('locations_send', (locations) => {
      console.log('loca', locations)

    })
    console.log('hi')
    return () => {
      socket.offAny(() => console.log('off any'))
      console.log('cleanup')
    }
  }, [])
  return (
    <div className="navbar" > <h1>Professor Geo {" "} <span role="img" aria-label="geo">🐱‍🏍</span></h1>
    {/* <Search /> */}
    <button onClick={() => {socket.emit('location_request', ['test'])}}>get random map</button>
    {inviteReceived ? "pending invite" : "no pending invite"}
    <button onClick={(params) => {
      socket.emit('CMCreateGame')
      
    }}>Create New Game</button>
    </div>
  )
}

const InterimResults = ({currentRound, setCurrentRound, setGameStatus}) => {

  const handleNextRound = () => {
    if (currentRound < 5){
      setGameStatus("isInRound")
      setCurrentRound(previousState => previousState + 1)
    }

    if (currentRound === 5) {
      setGameStatus("isGameOver")
      return <> </>
    }

  }

  return (
    <div>
      Marco da best 
      <button onClick={handleNextRound}>Next Round</button>
    </div>
  )

}

const MidgameResults = ({currentRound, setCurrentRound, setGameStatus}) => {

  return (
    <div className="midgameResults">
      <Navbar />
  <Map/>
  <InterimResults currentRound={currentRound} setCurrentRound={setCurrentRound} setGameStatus={setGameStatus} />
    </div>
  )


}


// const Map = () => {

//   const [coords, setCoords] = useState([])

//   const [sizeWH, setSizeWH] = useState({ width: 320, height: 200 })
//   const [position, setPosition] = useState({ x: 0, y: 0 })
//   const [dragging, setDragging] = useState(false)
//   const [containerStyle, setContainerStyle] = useState({
//     width: '100%',
//     height: '100%'
//   })


// const handleMapClick = (eventt) => {
//   setCoords(`Latitude: ${eventt.latLng.lat()} Longitude: ${eventt.latLng.lng()}`)
// }

// const containerStyle = {
//   width: "100%",
//   height: "100%"
// };
// const style = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   border: "solid 20px #ddd",
//   background: "#f0f0f0"
// };

// class Map extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       width: 200,
//       height: 200,
//       x: 10,
//       y: 10
//     };
//   }

//   render() {
//     return (
//         <div class="mapflex">
//           <button>test</button>
//         <Rnd
//           className={Map}
//           style={{backgroundColor: "#ff6f69", border: "10px solid green"}}
//           size={{ width: this.state.width, height: this.state.height }}
//           position={{ x: this.state.x, y: this.state.y }}
//           onDragStop={(e, d) => {
//             this.setState({ x: d.x, y: d.y });
//           }}
//           onResizeStop={(e, direction, ref, delta, position) => {
//             this.setState({
//               width: ref.style.width,
//               height: ref.style.height,
//               ...position
//             });
//           }}
//         >t<button>asd</button>
//         est
//           {/* <LoadScript googleMapsApiKey="AIzaSyANah7Rp_9i7F0FkhJ0w50q9TGqQbUErOM">
//             <GoogleMap
//               mapContainerStyle={containerStyle}
//               center={center}
//               zoom={10}
//               onClick={() => {
//                 console.log(this.state.x);
//               }}
//             ></GoogleMap>
//           </LoadScript> */}
//         </Rnd>
//         </div>
//     );
//   }
// }

// const Street = ({ center }) => {
//   const [coords, setCoords] = useState([])

//   const [sizeWH, setSizeWH] = useState({ width: 320, height: 200 })
//   const [position, setPosition] = useState({ x: 0, y: 0 })
//   const [dragging, setDragging] = useState(false)
//   const [containerStyleStreetView, setContainerStyleStreetView] = useState({
//     width: '100%',
//     height: '100%'
//   })
//   const [pano, setPano] = useState({
//     lat: -3.745,
//     lng: -38.523
//   })

//   return (
//     <div className="StreetView">
//       {/* <button onClick={() => {setPano({
//     lat: -3.745,
//     lng: -38.523
//   })}}>change location</button> */}
//       <LoadScript
//         googleMapsApiKey="AIzaSyANah7Rp_9i7F0FkhJ0w50q9TGqQbUErOM"
//       >
//         <GoogleMap
//           mapContainerStyle={containerStyleStreetView}
//           center={center}
//           zoom={10}
//         >
//           <StreetViewPanorama
//             position={pano}
//             visible={true}
//             options={{disableDefaultUI: true, enableCloseButton: false}}
//             onLoad={(panorama => setPano(panorama))}
            
//           />
//           { /* Child components, such as markers, info windows, etc. */}
//           <></>
//         </GoogleMap>
//       </LoadScript>
//     </div>
//   )
// }

export default Game;