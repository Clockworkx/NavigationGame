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

let rooms = []
console.log('romlength', rooms.length)

const getNewRoomName = () => {
    for (let i = 0; i < room.length; i++) {
      const element = array[i];
       
    }
    return roomName
    
}
console.log({players: [{playerName: 'player1', isReady: false}, {}], isGameStarted: false, isGameConcluded: false})
io.on('connection', socket => {
    
    socket.emit('SMConnectionReceived', `Connected to server`)
    socket.on('CMCreateGame', () => {
        console.log('create game')
        socket.join(`game${rooms.length+1}`)
        // console.log(socket.rooms)
        // console.log(io.sockets.adapter.rooms)

    })
    socket.on('CMCreateGame', (gameOptions) => {
        console.log('CMInvitePlayer', gameOptions)
        socket.join(`game${rooms.length+1}`)
        // console.log(socket.rooms)
        // console.log(io.sockets.adapter.rooms)

    })
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
    socket.onAny((eventName, ...args) => {
        console.log(eventName)
      });
      socket.on('connect_error', function(err) {
        console.log("client connect_error: ", err);
    });
    
    socket.on('connect_timeout', function(err) {
        console.log("client connect_timeout: ", err);
    });

})
// const randomPointsOnPolygon = require('random-position-in-polygon');
// const turf = require('turf');
 
// const numberOfPoints = 100;
// const polygon = turf.random('polygon').features[0];
 
// const points = randomPointsOnPolygon(1, polygon);
//console.log(points[0])

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
    for (let i = 0; i < 5; i++) {
        let newLocation
        //console.log(locations.some(location => location === newLocation ))
        while (locations.some(location => location === newLocation )) {
            console.log('double')
                newLocation = streetview()
        }
        
        locations[i] = streetview().map(location => ({lat: location}))
        //console.log('valid', isValidStreetView(locations[i]))
    }
   // console.log('loca loca', locations)
   return locations
}

const createNewGame = (creationDetails) => {
    
    
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
    console.log('received game request', body)
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
    createNewGame(creationDetails).then(gameDetails => response.status(201).send())
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

