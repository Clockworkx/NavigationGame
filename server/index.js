require = require("esm")(module/*, options*/)
module.exports = require("./main.js")
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
import randomStreetView from 'random-streetview'

io.on('connection', socket => {
    socket.emit('INVITE_RECEIVED', "invite info")
    console.log('user connected', socket.id)
    socket.on('disconnect', () => {
        console.log('disconnect')
    })
    socket.on('hello', (object) => {
        console.log(object[0])
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

app.use(cors())

app.use(express.json())

app.use(express.static('build'))

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

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => response.json(persons))

})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => response.send(`Phonebook has entries for ${persons.length} people 
    <br> Time of request: ${new Date()}`))
    .catch(error => console.log(error))
    
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => response.json(person))
    
    //else// response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end() 
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) return response.status(400).json({
        error: 'Number and or name of the person are missing'
    }) 

    // if (persons.some(person => person.name === body.name)) 
    // return response.status(400).json({
    //     error: "The name already exists in the phonebook"
    // })
    

    const person = new Person( {...body })
    console.log('new person', person)

    person.save().then(savedPerson => response.json(person))
    
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

