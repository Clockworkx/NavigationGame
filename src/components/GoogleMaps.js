import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  StreetViewPanorama,
} from "@react-google-maps/api";
import { useState, useRef, useCallback } from "react";
// import mapStyle from '../mapStyles'
import "../index.css";
import { socket } from "../services/socket";
import { formatRelative } from "date-fns";
import { Rnd } from "react-rnd";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 51.442315302157304,
  lng: 7.352482762465018,
};

//styles: mapStyle,
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const Map = ({
  location,
  guessMarkers,
  marker,
  setMarker,
  player,
  mapType,
  gameId,
  round,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyD-H7u_wA8hIqXBZteUdLr4oG0cVNoEl2c",
    libraries,
  });

  //const [marker, setMarker] = useState(null)
  const [selected, setSelected] = useState(null);

  //  const [markers, setMarkers] = useState(null)
  //   const [coords, setCoords] = useState([])

  // const [sizeWH, setSizeWH] = useState({ width: 320, height: 200 })
  // const [position, setPosition] = useState({ x: 0, y: 0 })
  // const [dragging, setDragging] = useState(false)
  //   const [containerStyle, setContainerStyle] = useState({
  //     width: '100%',
  //     height: '100%'
  //   })

  const handleMapClick = useCallback((event) => {
    console.log("maptype", mapType);
    if (mapType !== "game") return;
    // console.log('object', guessMarkers)
    // if (guessMarkers) return
    const marker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    socket.emit("CMSubmitGuess", player, marker, gameId, round);
    setMarker(marker);
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => (mapRef.current = map), []);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  const style = {
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    border: "solid 1px #ddd",
    zIndex: 10000,
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={3}
      center={center}
      options={options}
      onClick={handleMapClick}
      onLoad={onMapLoad}
    >
      {/* <button onClick={() => mapRef.current.panTo({lat: 43, lng: -75})}>pan To from Map reference</button> */}
      {marker ? (
        <Marker
          position={{ lat: marker.lat, lng: marker.lng }}
          icon={{
            url: "/test.png",
            scaledSize: new window.google.maps.Size(30, 30),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
          }}
          onClick={() => {
            setSelected(marker);
          }}
        />
      ) : null}

      {guessMarkers
        ? console.log("guessMarkers there", guessMarkers)
        : console.log("guessMarkers not there", guessMarkers)}

      {guessMarkers
        ? Object.values(guessMarkers).map((marker) => {
            if (!marker) return null;

            return (
              <Marker
                key={`${marker.lat + marker.lng}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: "/test.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                }}
                onClick={() => {
                  setSelected(marker);
                }}
              />
            );
          })
        : null}

      {mapType !== "game" ? (
        <Marker
          key={`${location.lat + location.lng}`}
          position={location}
          icon={{
            url: "/goalflag.jpg",
            scaledSize: new window.google.maps.Size(30, 30),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
          }}
          onClick={() => {
            setSelected(marker);
          }}
        />
      ) : null}

      {console.log("asd", mapType)}

      {/* {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h2>test</h2>
              <p>spotted at {formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null} */}
    </GoogleMap>
  );
};

const StreetView = ({ location, setIsStreetViewRendered }) => {
  console.log("LOCA in strteetview", location);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyD-H7u_wA8hIqXBZteUdLr4oG0cVNoEl2c",
    libraries,
  });
  //   const [coords, setCoords] = useState([])

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => (mapRef.current = map), []);
  const streetViewRef = React.useRef();
  const onStreetViewLoad = useCallback(
    (streetView) => {
      console.log("streetvie rendered", new Date().toISOString());
      setIsStreetViewRendered(true);
      return (streetViewRef.current = streetView);
    },
    [setIsStreetViewRendered]
  );

  if (loadError) return "Error loading maps";
  if (!isLoaded)
    return (
      <div>
        <p>"Loading Maps"</p>
      </div>
    );

  //center is location cahnge
  return (
    <div className="street-view">
      {/* <button onClick={() => console.log(mapRef.current)}>mapRef</button>
      <button onClick={() => console.log(streetViewRef.current)}>
        streetViewRef
      </button>
      <button
        onClick={() =>
          console.log(
            streetViewRef.current.getLocation().latLng.lat(),
            streetViewRef.current.getLocation().latLng.lat()
          )
        }
      >
        get Position street VIew
      </button> */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={3}
        center={location}
        options={options}
        onLoad={onMapLoad}
      >
        <StreetViewPanorama
          position={location}
          visible={true}
          options={{
            disableDefaultUI: true,
            enableCloseButton: false,
            showRoadLabels: false,
            fullscreenControl: true,
            panControl: true,
            linksControl: true,
          }}
          onLoad={onStreetViewLoad}
          onStatusChanged={() => console.log("status changed", streetViewRef)}
        />
        <div className="map-controls">
          <button
            className="button"
            onClick={() => streetViewRef.current.setPosition(location)}
          >
            back to start
          </button>
        </div>
      </GoogleMap>
    </div>
  );
};

export { Map, StreetView };
