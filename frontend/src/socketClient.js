import {io} from 'socket.io-client';
const socket = io('https://eventstreamobserver.onrender.com', {
    transports:['websocket'],
    autoConnect:true
});
socket.on('connect', ()=>{
    console.log('socket connected frontend ', socket.id);
});
socket.on('disconnect', (reason)=>{
    console.log('socket disconnected frontend reason: ', reason);
});

export default socket;


