// import { Rnd } from 'react-rnd'
// import { useState } from 'react'
import React from 'react'
import '../index.css';
import {Map, StreetView} from './GoogleMaps'
// import CurrentGameInfo from './components/CurrentGameInfo'
import Timer from './Timer'
import { useState, useRef, useEffect } from 'react'
import {socket} from '../services/socket'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
//import Game from './Game'
import CreateGame from './CreateGame'
import GameLobby from "./GameLobby";
import Game from './Game'
import './comp.css'
//team mode

const GameHome = () => {
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [locations, setLocations] = useState(null)
  const [player, setPlayer] = useState({name: null, ready: false})
  
  let match = useRouteMatch()
  console.log('lloca loca loca', locations)

  return (
    <div>
      <h1>GameHome Render</h1>

      <ul>
        <li>
          <Link to={`${match.url}/create`}>Create Game</Link>
        </li>
        <li>
          <Link to={`${match.url}/join`}>
            Join
          </Link>
        </li>
      </ul>
      {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
          
      <Switch>
        <Route path={`${match.path}/create`}>
          <h1>rendered creategame</h1>
          <CreateGame setLocations={setLocations}/>
        </Route>
        <Route path={`${match.path}/:gameId/lobby`}>
          <GameLobby setIsGameStarted={setIsGameStarted} player={player} setPlayer={setPlayer} locations={locations} setLocations={setLocations}/>
        </Route>
        <Route path={`${match.path}/:gameId`}>
          <Game locations={locations} player={player} />
        </Route>
        <Route path={match.path}>
          <h3>Create or find Game</h3>
        </Route>
      </Switch>
    </div>
  );
}


function RenderPath() {
  let match = useRouteMatch()
  console.log(match)
  let { topicId } = useParams();
  return <h3>Current path/component: {topicId}</h3>;
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

export default GameHome;