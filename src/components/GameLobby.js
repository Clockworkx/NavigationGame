import Navbar from './Navbar'

const { useState } = require("react")
const {socket} = require('../services/socket')


const CreateGame = () => {
    const [nameInput, setNameinput] = useState('')

    const handleNameInputChange = (event) => {
        console.log(event.target.value)
        setNameinput(event.target.value)
    }

    const handleSearchPlayerSubmit = (event) => {
        event.preventDefault()
        socket.emit('CMInvitePlayer', nameInput)
    }
    return (
        <div>
            <Navbar/>
            <form onSubmit={handleSearchPlayerSubmit}>
                <input value={nameInput} onChange={handleNameInputChange} />
                <button type="submit">Create Game Now</button>
                </form>
        </div>
    )
}

export default CreateGame