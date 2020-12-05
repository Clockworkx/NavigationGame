import { GoogleMap, LoadScript } from '@react-google-maps/api'
import {Rnd} from 'react-rnd'
import { useState } from 'react'
import './index.css';


const center = {
  lat: 51.165691,
  lng: 10.451526
}

const App = () => {
  const [coords, setCoords] = useState([])

  const [sizeWH, setSizeWH] = useState({width: 320, height: 200})
  const [position, setPosition] = useState({x: 0, y: 0})
  const [dragging, setDragging] = useState(false)
  const [containerStyle, setContainerStyle] = useState({
    width: '320px',
    height: '200px'
  })
  

  return (
    <div className="testt">
      
      mouse click position {coords}
      <Rnd className="test" 
      default={{
        x: 500,
        y: 0,
        width: 320,
        height: 200
      }}
      size={{width: sizeWH.width, height: sizeWH.height}}
      position={{x: position.x, y: position.y}}
      onDragStop={(e, d) => {
        setPosition({x: d.x, y:d.y})
      }}
      
      onResize={(e,direction, ref, delta, position) =>{
        console.log('e',e, 'd',direction, 'ref,', ref, 'delta',delta,'pos', position)
        console.log('a....',{...position})
        const newSize = {width: ref.offsetWidth, height: ref.offsetHeight}
        setSizeWH(newSize)
        setPosition({...position})
        
        setContainerStyle(newSize)
      }}
      disableDragging={dragging}
      > 
        <Map setCoords={setCoords} containerStyle={containerStyle}/>
        </Rnd>
        <div>
        asd<button onClick={() => setDragging(!dragging)}>CLICK</button>
        </div>
        
    </div>
  )
}

// cancel={".test"}
const Map = ({setCoords, containerStyle}) => {
  const handleMapClick = (eventt) => {
    setCoords(`Latitude: ${eventt.latLng.lat()} Longitude: ${eventt.latLng.lng()}`)
  }
  
  return (
    <div className="map1">
          <LoadScript googleMapsApiKey="AIzaSyANah7Rp_9i7F0FkhJ0w50q9TGqQbUErOM">
      <GoogleMap 
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
        >
      </GoogleMap>
    </LoadScript>
    </div>
  )

}

export default App;
