import { useState, useRef, useEffect } from 'react'

function useTimer(initial) {
    const [timer, setTimer] = useState(initial)
    const intervalRef = useRef()
  
    useEffect(() => {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
  
      return () => {
        clearInterval(intervalRef.current)
      }
    }, [])
  
    useEffect(() => {
      if (timer === 0) {
        clearInterval(intervalRef.current)
      }
    }, [timer])
    
    const formatted = {
      minutes: (timer - timer % 60)/60,
      seconds: String(timer % 60).padStart(2, "0")
    }
  
    return { timer, formatted }
  }
  
  function Timer({setTimerState}) {
    const { timer, formatted } = useTimer(2)
    console.log({ timer, formatted })
    console.log(timer)
    setTimerState(timer)
    return <div>{timer} - {formatted.minutes}:{formatted.seconds}</div>
  }

  export default Timer