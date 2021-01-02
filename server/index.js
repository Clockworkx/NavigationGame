require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const httpServer = require('http').createServer(app)
// const options = { /* ... */ };
const io = require("socket.io")(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

const Person = require('./models/person')
//const geoJSON = require('./countries.json')
const fetch = require('node-fetch')
var streetview = require('awesome-streetview')
const { resolve } = require('path')

let rooms = []
console.log('romlength', rooms.length)

const getNewRoomName = () => {
    for (let i = 0; i < room.length; i++) {
      const element = array[i];
       
    }
    return roomName
    
}
const games = []
const createNewGame = (creationDetails) => {
    const gameId = games.length 
    const locations = getLocations()
    //console.log({...creationDetails, gameId})
    games.push({...creationDetails, gameId, locations})
    //console.log(games[gameId])
    console.log('games', games)
   // console.log({gameId: games[gameId], locations})
    return games[gameId]
}

//console.log({players: [{playerName: 'player1', isReady: false}, {}], isGameStarted: false, isGameConcluded: false})
io.on('connection', socket => {
    console.log(io.sockets.adapter.rooms)
    socket.emit('SMConnectionReceived', `Connected to server`)
    socket.join(`game${rooms.length+1}`)
    socket.on('CMCreateGame', () => {
        console.log('create game')

        // console.log(socket.rooms)
        // console.log(io.sockets.adapter.rooms)

    })
    socket.on('CMPlayerReady', (player, gameId) => {
        if (!games[gameId]?.players) return console.log(`CMPlayerReady with undefined games[gameId] or .players`)
        
        const playerName = player.name
        const game = games[gameId]

        console.log('CMPlayerReady', playerName, gameId)

        console.log('players before', game.players)
        const playerIndex = game.players.findIndex(player => player.name === playerName)
        const sPlayer = games[gameId].players[playerIndex]
        console.log('bforesplayer', sPlayer)

        console.log('playerindex', playerIndex)

        games[gameId].players[playerIndex].ready = !sPlayer.ready
        console.log('players after', game.players)
        console.log('splayer', sPlayer)
        socket.emit('SMPlayerConfirmReady', sPlayer)
        io.to('game1').emit('SMChangeLobbyPlayerState', sPlayer)
        //if player is within game
        //associate username and socketid, if socketid dcs, set players: disconnect: true, if reconnect to game
        //check for user and send back gamedata
        // console.log(socket.rooms)
        // console.log(io.sockets.adapter.rooms)

    })
    socket.on('CMStartGameRequest', (gameId, players) => {

        //fix startgame without players
        if (!games[gameId]?.players) return console.log('game or players', gameId, 'not defined')
        if (games[gameId].players.some(player => player.ready === false))
            return io.to('game1')
                    .emit('SMStartGameDecline', 'Not All Players are ready')
        console.log(games[gameId].players)

        let playerNames = {}
        for (let i = 0; i < games[gameId].players.length; i++){
            console.log(games[gameId].players[i])
            const playerName = games[gameId].players[i].name
            console.log('playerName', playerName)
            playerNames[playerName] = null
            
        }
        console.log(playerNames)

        for (let i = 0; i < 5; i++){
            games[gameId].rounds.push({...playerNames})
        }
        console.log('rounds after request', games[gameId].rounds)
        io.to('game1').emit('SMStartGameAccept', gameId)
    })

    //ChangeLobbyPlayerState(newPlayerState)
    socket.on('CMPlayerSetName', (playerName, gameId) => {
        console.log('CMPlayerSetName', 'playerName', playerName, 'gameID', gameId)
        if (!games[gameId]) return console.log(`game ${gameId} doesnt exist`)

        if (games[gameId].players.some(player => player.name === playerName)) return socket.emit('SMPlayerDenySetName', 'name is used already')

        games[gameId].players.push({ name: playerName, ready: false })
        socket.emit('SMPlayerConfirmSetName', playerName)
        io.to('game1').emit('SMGamePlayerJoin', games[gameId].players)  //{name: playerName, ready: false}
        // console.log(socket.rooms)
        // console.log(io.sockets.adapter.rooms)

    })
    socket.on('CMSubmitGuess', async (player, guessPosition, gameId, round) => {
        // argument round: first round:  0
        console.log('rounds', games[gameId].rounds)
        games[gameId].rounds[round][player.name] = guessPosition
        console.log('call in submittguess')
        console.log(player, guessPosition,gameId, round)
        console.log(new Date())  
    })
    socket.on('CMGetMidgameResults', async (player, guessPosition, round) => {
        // socket.emit('testReceived', 'received')
         console.log(player, guessPosition, round)
         // testFunc()
         const statistics = await finishRound(round)
         socket.emit('SMFinishRound', statistics)
     })
     socket.on('CMGetGuessPositions', (playerName, round, gameId) => {
         console.log('CMGetGuessPositions', 'playerName', playerName, 'round', round, 'gameid', gameId)
         socket.emit('SMSendGuessPositions', games[gameId].rounds[round])
     } )
    
    console.log('user connected', socket.id)
    socket.on('disconnect', () => {
        console.log('disconnect')
    })
    socket.on('location_request', (object) => {
        console.log('emit from location_request', object[0])
        
        console.log('asd', getLocations())
        socket.emit('locations_send', getLocations())
        // getLocations().then(location => {
        //     console.log('Locations from getLocations()', location)
        //     socket.emit('locations_send', location)
        // }) 
        
    })
    // socket.onAny((eventName, ...args) => {
    //     console.log(eventName)
    //   });
      socket.on('connect_error', function(err) {
        console.log("client connect_error: ", err);
    });
    
    socket.on('connect_timeout', function(err) {
        console.log("client connect_timeout: ", err);
    });

})
const testFunc = () => {
    io.to('game1').emit('testReceived', 'received')
}
// const randomPointsOnPolygon = require('random-position-in-polygon');
// const turf = require('turf');
 
// const numberOfPoints = 100;
// const polygon = turf.random('polygon').features[0];
 
// const points = randomPointsOnPolygon(1, polygon);
//console.log(points[0])

const finishRound = (round) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve('done'), 1000)
    })
}

const isValidStreetView = async (locations) => {
    console.log(`https://maps.googleapis.com/maps/api/streetview/metadata?key=AIzaSyD-H7u_wA8hIqXBZteUdLr4oG0cVNoEl2c&location=${locations}`)
    const status = await fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?key=AIzaSyD-H7u_wA8hIqXBZteUdLr4oG0cVNoEl2c&location=${locations}`)
    .then(response => response.json()).then(json => {
       // console.log('t2',json)
        return json.status
        })
    console.log('t1',status)
    return status === 'OK'
}


async function fetchRandomLand() {
    // return fetch('https://api.3geonames.org/?randomland=DE&json=1').then(response => response.json())
    // .then(t =>{
    //     //console.log(t)
    //     isValidStreetView(`${t.nearest.latt}, ${t.nearest.longt}`)
    //     return {lat: t.nearest.latt, lng: t.nearest.longt}
    // })
    return streetview()
    isValidStreetView(`${t.nearest.latt}, ${t.nearest.longt}`)

  }
//   Promise.all([
//     fetchRandomLand(),
//     fetchRandomLand(),
//     fetchRandomLand(),
//     fetchRandomLand(),
//     fetchRandomLand()
//   ]).then(randomLands => {
//       console.log(randomLands)
//   })

const getLocations = () => {
    // return Promise.all(Array.from({ length: 5 }).map(fetchRandomLand)).then(locations => {
    //     isValidStreetView(locations)
    //     return locations
    // })
    let locations = [];
    let firstLocation = streetview()
    locations.push({lat: firstLocation[0], lng: firstLocation[1]})
    
    for (let i = 0; i < 4; i++) {
        let newLocation = streetview()
        while (locations.some(location => location === newLocation )) {
            console.log('double')
            newLocation = streetview()
        }
        locations.push({lat: newLocation[0], lng: newLocation[1]})
        //console.log('valid', isValidStreetView(locations[i]))
    }
   return locations
}



app.use(cors())

app.use(express.json())

// app.use(express.static('build'))

// const createLocations = async () => {
//     const locations = await randomStreetView.getRandomLocations(2);
//     return locations
// }

// console.log(createLocations())

morgan.token('postData', (req, res) => {
    if (req.method === 'POST') return console.log(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


app.get('/', (request, response) => {
    response.send('<h1>Seite wäre hier</h1>')
})

app.get('/api/game', (request, response) => {
    Person.find({}).then(persons => response.json(persons))
    response.send('<hi>hi</hi>')

})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => response.send(`Phonebook has entries for ${persons.length} people 
    <br> Time of request: ${new Date()}`))
    .catch(error => console.log(error))
    
})

app.get('/api/game/:id', (request, response) => {
    Person.findById(request.params.id).then(person => response.json(person))
    
    //else// response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end() 
})

app.post('/api/game', (request, response) => {
    const creationDetails = request.body
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
    response.status(201).json(createNewGame(creationDetails))
})

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  }

