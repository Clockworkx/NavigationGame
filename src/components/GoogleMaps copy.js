import React from 'react'
import { GoogleMap, useLoadScript, Marker, InfoWindow, StreetViewPanorama } from '@react-google-maps/api'
import { useState, useRef, useCallback } from 'react'
// import mapStyle from '../mapStyles'
import '../index.css'
// import usePlacesAutocomplete, {
//     getGeocode,
//     getLatLng,
// } from "use-places-autocomplete";
// import {
//     Combobox,
//     ComboboxInput,
//     ComboboxPopover,
//     ComboboxList,
//     ComboboxOption,
// } from "@reach/combobox";
import { formatRelative } from "date-fns";

// import "@reach/combobox/styles.css";


const libraries = ["places"]
const mapContainerStyle = {
    width: "100%",
    height: "100%"
}

const center = {
    lat: 40.745,
    lng: -38.523
}
//styles: mapStyle,
const options = {

    disableDefaultUI: true,
    zoomControl: true
}


const Map = () => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyD-H7u_wA8hIqXBZteUdLr4oG0cVNoEl2c',
        libraries,
    })

    const [marker, setMarker] = useState([])
    const [selected, setSelected] = useState(null)
    //   const [coords, setCoords] = useState([])

    // const [sizeWH, setSizeWH] = useState({ width: 320, height: 200 })
    // const [position, setPosition] = useState({ x: 0, y: 0 })
    // const [dragging, setDragging] = useState(false)
    //   const [containerStyle, setContainerStyle] = useState({
    //     width: '100%',
    //     height: '100%'
    //   })


    const handleMapClick = useCallback(event => {
        setMarker({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            time: new Date()
        })
    }, [])

    const mapRef = useRef();
    const onMapLoad = useCallback(map => mapRef.current = map, [])
    const streetViewRef = useRef()
    const onStreetViewLoad = useCallback(streetView => streetViewRef.current = streetView, [])

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps"



    return (
        <div className="Map">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={3}
                center={center}
                options={options}
                onClick={handleMapClick}
                onLoad={onMapLoad}
            >
                <Marker
                    position={{ lat: marker.lat, lng: marker.lng }}
                    icon={{
                        url: "/test.png",
                        scaledSize: new window.google.maps.Size(30, 30),
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(15, 15)
                    }}
                    onClick={() => {
                        setSelected(marker)
                    }}
                />
                {selected ? (
                    <InfoWindow position={{ lat: selected.lat, lng: selected.lng }}
                        onCloseClick={() => setSelected(null)}>
                        <div>
                            <h2>test</h2>
                            <p>spotted at {formatRelative(selected.time, new Date())}</p>
                        </div>
                    </InfoWindow>) : null}
                <StreetViewPanorama
                    position={center}
                    visible={false}
                    options={{ disableDefaultUI: true, enableCloseButton: false }}
                    onLoad={onStreetViewLoad}
                />
            </GoogleMap>
        </div>
    )
}

const test = new window.google.maps.StreetViewPanorama({<div></div>})

const StreetView = () => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyD-H7u_wA8hIqXBZteUdLr4oG0cVNoEl2c',
        libraries,
    })
    //   const [coords, setCoords] = useState([])

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback(map => mapRef.current = map, [])
    const streetViewRef = React.useRef()
    const onStreetViewLoad = useCallback(streetView => console.log(streetView), [])

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps"



    return (
        <div className="Map">
            {/* <button onClick={streetViewRef.setPosition({lat: -3.745, lng: -38.523})}>return to home</button> */}
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={3}
                center={center}
                options={options}
                onLoad={onMapLoad}
            >
                <StreetViewPanorama
                    position={{lat: -3.745, lng: -38.523}}
                    visible={true}
                    options={{ disableDefaultUI: true, enableCloseButton: false }}
                    onLoad={onStreetViewLoad}
                />
            </GoogleMap>
        </div>
    )
}

// {markers.map(marker => (
//     <Marker
//         key={`${marker.lat + marker.lng}`}
//         position={{ lat: marker.lat, lng: marker.lng }}
//         icon={{
//             url: "/test.png",
//             scaledSize: new window.google.maps.Size(30, 30),
//             origin: new window.google.maps.Point(0, 0),
//             anchor: new window.google.maps.Point(15, 15)
//         }}
//         onClick={() => {
//             setSelected(marker)
//         }}
//     />
// ))}

// const Search = () => {
//     const { ready, value, suggestions: { status, data }, setValue, clearSuggestion }
//         = usePlacesAutocomplete({
//             requestOptions: {
//                 location: { lat: () => 43.6532, lng: () => -79.3832},
//                 radius: 200 * 1000
//             },
//         })

//     return <div className="search">
//         <Combobox
//             onSelect={adress => {
//                 console.log(adress)
//             }}>
//             <ComboboxInput value={value} onChange={(e) => {
//                 setValue(e.target.value)
//             }}
//                 disabled={!ready}
//                 placeholder="Enter an adress"
//             />
//             <ComboboxPopover>
//                 {status === "OK" && data.map(({id, description}) =>
//                  <ComboboxOption key={id} value={description}/>)}
//             </ComboboxPopover>
//         </Combobox>
//     </div>

// }


// function haversine_distance(mk1, mk2) {
//     var R = 3958.8; // Radius of the Earth in miles
//     var rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
//     var rlat2 = mk2.position.lat() * (Math.PI/180); // Convert degrees to radians
//     var difflat = rlat2-rlat1; // Radian difference (latitudes)
//     var difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

//     var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
//     return d;
//   }

export {Map, StreetView}