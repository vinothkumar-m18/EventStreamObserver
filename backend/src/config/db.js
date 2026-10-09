import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

export const connectDB = async() => {
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            dbName:'eventstream'
        });
        logger.info('MongoDB connected', {
            host: connection.connection.host,
            dbName: connection.connection.name
        });
    }catch(error){
        logger.error('Database connection error', {
            message: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
};