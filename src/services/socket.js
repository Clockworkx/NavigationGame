import { io } from 'socket.io-client';
const socketUrl = "http://localhost:3001"

export const socket = io(socketUrl)