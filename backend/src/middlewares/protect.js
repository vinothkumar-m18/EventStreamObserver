import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const protect = (req, res, next)=>{
    try{        
        // console.log('req headers: ', req.headers);
        console.log('auth headers: ', req.headers.authorization);
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({message:'not authorized'});
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }catch(error){
        console.log('error inside protect middleware: ', error);
        return res.status(401).json({message:'token invalid or expired'});
    }
};
export default protect;