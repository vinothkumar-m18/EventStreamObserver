import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

export const register = async (req, res)=>{
    try{
        const {email, password} = req.body;
        const existing = await User.findOne({email});

        if(existing){
            logger.warn('Registration failed because user already exists', { email });
            return res.status(400).json({message:'user already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password:hashedPassword
        });

        logger.info('User registered successfully', {
            userId: newUser._id,
            email: newUser.email
        });

        return res.status(200).json({message:'user registered'});
    }catch(error){
        logger.error('Error registering user', {
            message: error.message,
            stack: error.stack,
            email: req.body.email
        });
        return res.status(500).json({message:'internal server error'});
    }
};

export const login = async (req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            logger.warn('Login attempt failed: invalid credentials', { email });
            return res.status(401).json({message:'invalid credentials'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            logger.warn('Login attempt failed: password mismatch', { userId: user._id, email });
            return res.status(401).json({message:'invalid credetials'});
        }

        const token = jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );

        logger.info('User logged in successfully', {
            userId: user._id,
            email: user.email
        });

        return res.json({
            token,
            message:'logged in'
        });
    }catch(error){
        logger.error('Login error', {
            message: error.message,
            stack: error.stack,
            email: req.body.email
        });
        return res.status(500).json({message:'internal server error'});
    }
};
