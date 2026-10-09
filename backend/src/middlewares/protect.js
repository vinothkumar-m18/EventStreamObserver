import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import User from '../models/User.js';

dotenv.config();

const protect = async (req, res, next) => {
    try {
        if (req.method === 'OPTIONS') {
            return next();
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn('Missing bearer token in auth middleware', {
                method: req.method,
                url: req.originalUrl
            });
            return res.status(401).json({ message: 'not authorized' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            logger.warn('Unauthorized request: user no longer exists', {
                userId: decoded.userId,
                url: req.originalUrl
            });
            return res.status(401).json({ msg: 'user no longer exists' });
        }

        req.userId = user._id;
        logger.info('User authenticated successfully', {
            userId: user._id,
            url: req.originalUrl,
            method: req.method
        });
        next();
    } catch (error) {
        logger.error('Authentication middleware failed', {
            message: error.message,
            stack: error.stack,
            url: req.originalUrl,
            method: req.method
        });
        return res.status(401).json({ message: 'token invalid or expired' });
    }
};

export default protect;