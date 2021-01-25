import axios from 'axios'
const baseUrl = '/api'

const getAll = () => {
    const request = axios.get(baseUrl)
    const nonExisting = {
        id: 10000,
        content: 'This note is not saved to server',
        date: '2019-05-30T17:30:31.098Z',
        important: true,
      }
    return request.then(response => response.data.concat(nonExisting))
}

const createGame = newObject => {
    const request = axios.post(`${baseUrl}/game/`, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.patch(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

export default {
    getAll,
    createGame,
    update
}