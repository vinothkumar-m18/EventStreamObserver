import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();
const protect = async (req, res, next)=>{
    try{        
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            console.log('no token inside middleware');
            return res.status(401).json({message:'not authorized'});
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if(!user){
            console.log('user no longer exists inside middleware');
            return res.status(401).json({msg:'user no longer exists'});
        }
        req.userId = user._id;
        next();
    }catch(error){        
        console.log('error inside protect middleware: ', error);
        return res.status(401).json({message:'token invalid or expired'});
    }
};
export default protect;