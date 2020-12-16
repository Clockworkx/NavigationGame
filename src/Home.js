import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Game from './App'
import Maps2 from './GoogleMaps'

const Home = () => (
  <div> <h2>TKTL notes app</h2> </div>
)

const Notes = () => (
  <div> <h2>Statistics</h2> </div>
)

const Users = () => (
  <div> <h2>Users</h2> </div>
)




const App = () => {
  const [page, setPage] = useState('game')

 const toPage = (page) => (event) => {
    event.preventDefault()
    setPage(page)
  }

  const content = () => {
    if (page === 'game') {
      return <Game />
    } else if (page === 'maps2') {
      return <Maps2 />
    } else if (page === 'users') {
      return <Users />
    }
  }


  const padding = {
    padding: 5
  }

  return (
    <div className="fornavbar">
      <div>
        <a href="" onClick={toPage('game')} style={padding}>
          Game
        </a>
        <a href="" onClick={toPage('maps2')} style={padding}>
          Maps2
        </a>
        <a href="" onClick={toPage('users')} style={padding}>
          Users
        </a>
        <a href="" onClick={toPage('timer')} style={padding}>
          Timer
        </a>
      </div>

      {content()}
    </div>
  )
}

export default App