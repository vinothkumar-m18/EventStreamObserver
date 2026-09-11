import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import webhookRoutes from './routes/webhookRoutes.js';
import sourcesRoutes from './routes/sourceRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import authRoutes from './routes/authRoutes.js';
import protect from './middlewares/protect.js';
const app = express();
app.use(express.json());
app.use(cors({
    origin:['https://eventstreamobserver-1.onrender.com', 'http://localhost:5173']
}));
app.use(morgan('dev'));
app.use('/api/webhook', webhookRoutes);
app.use('/api/sources', protect, sourcesRoutes);
app.use('/api/events', protect, eventRoutes);
app.use('/api/auth', authRoutes);


// api health check route
app.get('/', (req, res)=>{
    res.json({message:'Eventstream observer API is running'});
});

// Error handling
//If a route doesn't exist
app.use((req, res, next)=>{
    res.status(404).json({message:'route not found'});
});

//catch unexpected errors
app.use((err, req, res, next)=>{
    console.error('server error ', err);
    res.status(500).json({message:'internal server error'});
});

export default app;
// 2