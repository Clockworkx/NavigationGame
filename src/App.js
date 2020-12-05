import { GoogleMap, LoadScript, StreetViewPanorama } from '@react-google-maps/api'
import {Rnd} from 'react-rnd'
import { useState } from 'react'
import './index.css';

const App = () => {
  const [coords, setCoords] = useState([])

  const [sizeWH, setSizeWH] = useState({width: 320, height: 200})
  const [position, setPosition] = useState({x: 0, y: 0})
  const [dragging, setDragging] = useState(false)
  const [containerStyle, setContainerStyle] = useState({
    width: '320px',
    height: '200px'
  })
  const [center, setCenter] = useState({
    lat: -3.745,
    lng: -38.523
  })

  const handleCenterChange1 = (event) => {
    console.log(event.target.value)
    setCenter({...center,lat: Number(event.target.value) })
  }
  const handleCenterChange2 = (event) => {
    console.log(event.target.value)
    setCenter({...center,lng: Number(event.target.value) })
  }

  return (
    <div onMouseEnter={() => null} onMouseLeave={()=> null}className="testt">
    
      
      mouse click position {coords}
      <Rnd className="Map" 
      default={{
        x: 500,
        y: 500,
        width: 320,
        height: 200
      }}
      size={{width: sizeWH.width, height: sizeWH.height}}
      position={{x: position.x, y: position.y}}
      onDragStop={(e, d) => {
        console.log('asd', d)
        setPosition({x: d.x, y:d.y})
      }}
      
      onResize={(e,direction, ref, delta, position) =>{
        // console.log('e',e, 'd',direction, 'ref,', ref, 'delta',delta,'pos', position)
        // console.log('a....',{...position})
        const newSize = {width: ref.offsetWidth, height: ref.offsetHeight}
        setSizeWH(newSize)
        setPosition({...position})
        
        setContainerStyle(newSize)
      }}
      disableDragging={dragging}
      > 
        <Map setCoords={setCoords} containerStyle={containerStyle} center={center}/>
        </Rnd>


        <Rnd className="Street" 
      default={{
        x: 500,
        y: 500,
        width: 320,
        height: 200
      }}
      size={{width: sizeWH.width, height: sizeWH.height}}
      position={{x: position.x, y: position.y}}
      onDragStop={(e, d) => {
        console.log('asd', d)
        setPosition({x: d.x, y:d.y})
      }}
      
      onResize={(e,direction, ref, delta, position) =>{
        // console.log('e',e, 'd',direction, 'ref,', ref, 'delta',delta,'pos', position)
        // console.log('a....',{...position})
        const newSize = {width: ref.offsetWidth, height: ref.offsetHeight}
        setSizeWH(newSize)
        setPosition({...position})
        
        setContainerStyle(newSize)
        
      }}
      disableDragging={dragging}
      > 
         <Street containerStyle={containerStyle} center={center} />
        </Rnd>
       




        <div>
        asd<button onClick={() => setDragging(!dragging)}>CLICK</button>
        <input onChange={handleCenterChange1}/>
        <input onChange={handleCenterChange2}/>
        <button onClick={() => setCenter({lat:51.16569})}> asd
        </button>
        </div>
        
    </div>
  )
}

// cancel={".test"}
const Map = ({setCoords, containerStyle, center}) => {
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
// const containerStyle = {
//   width: '400px',
//   height: '400px'
// };

// const center = {
//   lat: -3.745,
//   lng: -38.523
// };

function Street({containerStyle, center}) {
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyANah7Rp_9i7F0FkhJ0w50q9TGqQbUErOM"
    >
      <GoogleMap
        mapContainerStyle={containerStyle
          }
        center={center}
        zoom={10}
      >
            <StreetViewPanorama
      position={{
        lat: -3.745,
        lng: -38.523
      }}
      visible={true}
    />
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
    </LoadScript>
  )
}



export default App;
