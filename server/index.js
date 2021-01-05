require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const httpServer = require("http").createServer(app);
// const options = { /* ... */ };
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const Person = require("./models/person");
//const geoJSON = require('./countries.json')
const fetch = require("node-fetch");
var streetview = require("awesome-streetview");
const { resolve } = require("path");
const { update } = require("./models/person");

let rooms = [];
console.log("romlength", rooms.length);

const getNewRoomName = () => {
  for (let i = 0; i < room.length; i++) {
    const element = array[i];
  }
  return roomName;
};
const games = [];
const createNewGame = async (creationDetails) => {
  const gameId = games.length;
  console.log("object", gameId);
  const locations = await getLocations();
  console.log("locations in newgame", locations);
  //console.log({...creationDetails, gameId})
  games.push({ ...creationDetails, gameId, locations });
  //console.log(games[gameId])
  console.log("games", games);
  // console.log({gameId: games[gameId], locations})
  return games[gameId];
};

//console.log({players: [{playerName: 'player1', isReady: false}, {}], isGameStarted: false, isGameConcluded: false})
io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("disconnect");
  });

  console.log(io.sockets.adapter.rooms);

  socket.emit("SMConnectionReceived", `Connected to server`);

  socket.join(`game${rooms.length + 1}`);

  socket.on("CMCreateGame", () => {
    console.log("create game");

    // console.log(socket.rooms)
    // console.log(io.sockets.adapter.rooms)
  });

  socket.on("CMPlayerReady", (player, gameId) => {
    if (!games[gameId]?.players)
      return console.log(
        `CMPlayerReady with undefined games[gameId] or .players`
      );

    const playerName = player.name;
    const game = games[gameId];

    console.log("CMPlayerReady", playerName, gameId);

    console.log("players before", game.players);
    const playerIndex = game.players.findIndex(
      (player) => player.name === playerName
    );
    const sPlayer = games[gameId].players[playerIndex];
    console.log("bforesplayer", sPlayer);

    console.log("playerindex", playerIndex);

    games[gameId].players[playerIndex].ready = !sPlayer.ready;
    console.log("players after", game.players);
    console.log("splayer", sPlayer);
    socket.emit("SMPlayerConfirmReady", sPlayer);
    io.to("game1").emit("SMChangeLobbyPlayerState", sPlayer);
    //if player is within game
    //associate username and socketid, if socketid dcs, set players: disconnect: true, if reconnect to game
    //check for user and send back gamedata
    // console.log(socket.rooms)
    // console.log(io.sockets.adapter.rooms)
  });

  socket.on("CMStartGameRequest", (gameId, players) => {
    //fix startgame without players
    if (!games[gameId]?.players)
      return console.log("game or players", gameId, "not defined");
    if (games[gameId].players.some((player) => player.ready === false))
      return io
        .to("game1")
        .emit("SMStartGameDecline", "Not All Players are ready");
    console.log("das isses nicht", games[gameId].players);

    let playerNames = {};
    for (let i = 0; i < games[gameId].players.length; i++) {
      console.log(games[gameId].players[i]);
      const playerName = games[gameId].players[i].name;
      console.log("playerName", playerName);
      playerNames[playerName] = null;
    }
    console.log(playerNames);

    for (let i = 0; i < 5; i++) {
      games[gameId].estimates.push({ ...playerNames });
    }

    console.log("games[gameid]", games[gameId].locations);
    console.log("estimates after request", games[gameId].estimates);
    io.to("game1").emit("SMStartGameAccept", gameId, games[gameId].locations);
  });

  //ChangeLobbyPlayerState(newPlayerState)
  socket.on("CMPlayerSetName", (playerName, gameId) => {
    console.log("CMPlayerSetName", "playerName", playerName, "gameID", gameId);
    if (!games[gameId]) return console.log(`game ${gameId} doesnt exist`);

    if (games[gameId].players.some((player) => player.name === playerName))
      return socket.emit("SMPlayerDenySetName", "name is used already");

    games[gameId].players.push({ name: playerName, ready: false });
    socket.emit("SMPlayerConfirmSetName", playerName);
    io.to("game1").emit("SMGamePlayerJoin", games[gameId].players); //{name: playerName, ready: false}
    // console.log(socket.rooms)
    // console.log(io.sockets.adapter.rooms)
  });

  socket.on("CMSubmitGuess", async (player, guessPosition, gameId, round) => {
    // argument round: first round:  0
    console.log("estimates", games[gameId].estimates);
    games[gameId].estimates[round][player.name] = guessPosition;
    console.log("call in submittguess", player, guessPosition, gameId, round);
    console.log(new Date());
  });

  socket.on("CMGetMidgameResults", (gameId, round) => {
    console.log(games[gameId]);
    console.log("CMGetMidgameResults", gameId, round);

    let playerDistances = {};
    Object.entries(games[gameId].estimates[round]).forEach(([key, value]) => {
      playerDistances[key] = value.distance;
    });

    socket.emit("SMSendMidgameResults", playerDistances);
  });
  socket.on("CMGetGuessPositions", (playerName, round, gameId) => {
    console.log(
      "CMGetGuessPositions",
      "playerName",
      playerName,
      "round",
      round,
      "gameid",
      gameId
    );
    socket.emit("SMSendGuessPositions", games[gameId].estimates[round]);
  });

  socket.on("CMFinishRound", (gameId, playerName, round) => {
    console.log("called cmfinishRound");
    updateRoundStatistics(playerName, gameId, round);
  });
  function updateRoundStatistics(playerName, gameId, round) {
    const goalPosition = games[gameId].locations[round];
    const playerGuessPosition = games[gameId].estimates[round][playerName];
    console.log("goal position)", goalPosition);
    console.log("playerguess)", playerGuessPosition);
    const deltaDistance = haversine_distance(goalPosition, playerGuessPosition);
    console.log("distance from goal", deltaDistance);
    games[gameId].estimates[round][playerName].distance = deltaDistance;
    console.log("estiumates,", games[gameId].estimates[round]);
  }

  // socket.on('location_request', (object) => {
  //     console.log('emit from location_request', object[0])

  //     console.log('asd', getLocations())
  //     socket.emit('locations_send', getLocations())
  // })
  // socket.onAny((eventName, ...args) => {
  //     console.log(eventName)
  //   });
  socket.on("connect_error", function (err) {
    console.log("client connect_error: ", err);
  });

  socket.on("connect_timeout", function (err) {
    console.log("client connect_timeout: ", err);
  });
});

function haversine_distance(mk1, mk2) {
  var R = 6371.071; // Radius of the Earth in km
  var rlat1 = mk1.lat * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = mk2.lat * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)

  var d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  return d;
}
const testFunc = () => {
  io.to("game1").emit("testReceived", "received");
};
// const randomPointsOnPolygon = require('random-position-in-polygon');
// const turf = require('turf');

// const numberOfPoints = 100;
// const polygon = turf.random('polygon').features[0];

// const points = randomPointsOnPolygon(1, polygon);
//console.log(points[0])

const finishRound = (round) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("done"), 1000);
  });
};

const isValidStreetView = async (location) => {
  let radius = 100;
  let status = "NOT OK";

  //console.log(status);
  while (status.status !== "OK" && radius < 1000) {
    //console.log('', status)
    status = await fetch(
      `https://maps.googleapis.com/maps/api/streetview/metadata?location=${location}&radius=${radius}&source=default&key=AIzaSyD-H7u_wA8hIqXBZteUdLr4oG0cVNoEl2c`
    ).then((response) => response.json());
    radius = Math.round(radius * 2.5);
  }
  //  console.log('t1',status)
  return status;
};

// const response = await fetch('getland api call');
// if (!response.ok) {
//   throw new Error(`Non-okay response from getland API: ${response.status}`);
// }

// const body = await response.json();

async function fetchRandomLand() {
  return fetch("https://api.3geonames.org/?randomland=DE&json=1")
    .then((response) => response.json())
    .then((t) => {
      //console.log("random lat long", t.major);
      return isValidStreetView(`${t.major.latt},${t.major.longt}`).then(
        (status) => {
          // console.log("status", status);
          if (status.status === "ZERO_RESULTS") return fetchRandomLand();
          return status.location;
        }
      );
    });
}
//   async function fetchRandomLand() {
//     let json;
//     while (!some condition) {
//         json = (await fetch('https://api/...')).json();
//     }

//     console.log(status.status);
//   }
// Promise.all([
//   fetchRandomLand(),
//   fetchRandomLand(),
//   fetchRandomLand(),
//   fetchRandomLand(),
//   fetchRandomLand(),
// ]).then((randomLands) => {
//   console.log("randomlands", randomLands);
// });

// while (true) {

//     console.log(fetchRandomLand())
// }

const getLocations = () => {
  return Promise.all(Array.from({ length: 5 }).map(fetchRandomLand)).then(
    (locations) => {
      console.log("loca loca", locations);
      return locations;
    }
  );
  //     let locations = [];
  //     let firstLocation = streetview()
  //     locations.push({lat: firstLocation[0], lng: firstLocation[1]})

  //     for (let i = 0; i < 4; i++) {
  //         let newLocation = streetview()
  //         while (locations.some(location => location === newLocation )) {
  //             console.log('double')
  //             newLocation = streetview()
  //         }
  //         locations.push({lat: newLocation[0], lng: newLocation[1]})
  //         //console.log('valid', isValidStreetView(locations[i]))
  //     }
  //    return locations
};

//getLocations()

app.use(cors());

app.use(express.json());

// app.use(express.static('build'))

// const createLocations = async () => {
//     const locations = await randomStreetView.getRandomLocations(2);
//     return locations
// }

// console.log(createLocations())

morgan.token("postData", (req, res) => {
  if (req.method === "POST") return console.log(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
);

app.get("/", (request, response) => {
  response.send("<h1>Seite wäre hier</h1>");
});

// app.get("/api/game", (request, response) => {
//   Person.find({}).then((persons) => response.json(persons));
//   response.send("<hi>hi</hi>");
// });

app.get("/info", (request, response) => {
  Person.find({})
    .then((persons) =>
      response.send(`Phonebook has entries for ${persons.length} people 
    <br> Time of request: ${new Date()}`)
    )
    .catch((error) => console.log(error));
});

app.get("/api/game/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => response.json(person));

  //else// response.status(404).end()
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/game", async (request, response) => {
  const creationDetails = request.body;
  //console.log('received game request', creationDetails)
  // if (!body.name || !body.number) return response.status(400).json({
  //     error: 'Number and or name of the person are missing'
  // })

  // if (persons.some(person => person.name === body.name))
  // return response.status(400).json({
  //     error: "The name already exists in the phonebook"
  // })

  // const person = new Person( {...body })
  // console.log('new person', person)

  // person.save().then(savedPerson => response.json(person))
  const asd = await createNewGame(creationDetails);
  console.log("aaaaa", asd);
  response.status(201).json(await createNewGame(creationDetails));
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
