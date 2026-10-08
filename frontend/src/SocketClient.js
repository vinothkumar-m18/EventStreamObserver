// socket client
import { io } from 'socket.io-client';

const token = localStorage.getItem('token');
const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket', 'polling'],   
    ...(token ? {
        extraHeaders: {
            Authorization: `Bearer ${token}`
        }
    } : {})
});

socket.on('connect', () => {
    console.log('socket connected frontend ', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('socket disconnected frontend reason: ', reason);
});

export default socket;


