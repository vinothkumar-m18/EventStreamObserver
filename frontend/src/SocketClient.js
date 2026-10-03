// socket client
import {io} from 'socket.io-client';
const socket = io('https://creamer-startling-vitally.ngrok-free.dev', {
    transports:['websocket'],
    autoConnect:true,
    extraHeaders:{
        'ngrok-skip-browser-warning':'true'
    }
});
socket.on('connect', ()=>{
    console.log('socket connected frontend ', socket.id);
});
socket.on('disconnect', (reason)=>{
    console.log('socket disconnected frontend reason: ', reason);
});
export default socket;


