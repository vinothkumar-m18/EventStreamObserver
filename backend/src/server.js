import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { getTime } from './utils/getTime.js';
dotenv.config();
const PORT = process.env.PORT || 5000;
//create HTTP server from express app
const server = http.createServer(app);
// embedding http server into a websocket server for real time data updates
export const io = new Server(server, {
    pingInterval: 25000,
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:5173'
    }
});

try {
    io.on('connection', (socket)=>{
        console.log(`socket connected backend id:${socket.id} @${getTime()}`);

        socket.on('disconnect', (reason)=>{
            console.log(`socket disconnected backend reason:${reason}@${getTime()}`);
        });

        socket.on('error', (err)=>{
            console.log(`socket error id:${socket.id} message:${err.message}`);
        });
    });
} catch (error) {
    console.log('socket error: ', error);
}
// establishing db connection and starting the server
connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.log('DB connection error ', error);
        process.exit(1);
    })

