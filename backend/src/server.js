import http from 'http';
import {Server} from 'socket.io';
import app from './app.js';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import { getTime } from './utils/getTime.js';
dotenv.config();
const PORT = process.env.PORT || 5000;
//create HTTP server from express app
const server = http.createServer(app);
// embedding http server into a websocket server for real time data updates
export const io = new Server(server, {
    cors:{
        origin:'*'
    }
});
try{
    io.on('connection', (socket)=>{
        console.log(`socket connected id:${socket.id} @${getTime()}`);
        // console.log(' from IP: ', socket.handshake.address);
        // console.log(' with headers: ', socket.handshake.headers.origin);
        socket.on('disconnect', ()=>{
            console.log(`socket disconnected id:${socket.id} @${getTime()}`);
        });
    });
}catch(error){
    console.log('socket error: ', error);
}
// establishing db connection and starting the server
connectDB()
.then(()=>{
    server.listen(PORT, ()=>{
        console.log(`server running on port ${PORT}`);
    });
})
.catch(error =>{
    console.log('DB connection error ', error);
    process.exit(1);
})

