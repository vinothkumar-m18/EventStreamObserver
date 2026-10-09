import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import { connectDB } from './config/db.js';
import { getTime } from './utils/getTime.js';
import { corsOptions } from './app.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

// create HTTP server from express app
const server = http.createServer(app);

// embedding http server into a websocket server for real time data updates
const io = new Server(server, {
    pingInterval: 25000,
    pingTimeout: 60000,
    cors: {
        ...corsOptions,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
    }
});
app.set('io', io);

io.on('connection', (socket) => {
    logger.info('Socket client connected', {
        socketId: socket.id,
        timestamp: getTime()
    });

    socket.on('disconnect', (reason) => {
        logger.info('Socket client disconnected', {
            socketId: socket.id,
            reason,
            timestamp: getTime()
        });
    });

    socket.on('error', (err) => {
        logger.error('Socket IO error', {
            socketId: socket.id,
            message: err.message,
            stack: err.stack
        });
    });
});

// establishing db connection and starting the server
connectDB()
    .then(() => {
        server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        logger.error('Database connection failed during startup', {
            message: error.message,
            stack: error.stack
        });
        process.exit(1);
    });

