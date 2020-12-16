import Timer from '../components/Timer'
import { useState, useRef, useEffect } from 'react'

const CurrentGameInfo = () => {
    const [isGameStarted, setIsGameStarted] = useState(false)

    const handleStartGame = (event) => {
        console.log(event)
        setIsGameStarted(!isGameStarted)

    }
    if (isGameStarted)
    return (
        <div>
            <Timer /> 
            Round , 
        </div>
    )
    else return (
        <div>Waiting for Host to start game
            <button onClick={handleStartGame}>Start Game</button>
        </div>
        
    )

}

export default CurrentGameInfo