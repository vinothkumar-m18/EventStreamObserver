import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const register = async (req, res)=>{
    try{
        const {email, password} = req.body;
        const existing = await User.findOne({email});
        if(existing){
            return res.status(400).json({message:'user already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password:hashedPassword
        });
        return res.status(200).json({message:'user registered'});        
    }catch(error){
        console.log('error registering user: ', error);
        return res.status(500).json({message:'internal server error'});
    }
};
export const login = async (req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            console.log('invalid credentials');
            return res.status(401).json({message:'invalid credentials'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message:'invalid credetials'});
        }
        const token = jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );
        return res.json({
            token,
            message:'logged in'
        });
    }catch(error){
        console.log('login error: ', error);
        return res.status(500).json({message:'internal server error'});
    }
};
