import app from './app.js';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
const PORT = process.env.PORT || 5000;
connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`server running on port:${PORT}`);        
    })
}
).catch(error =>{
    console.log('db connection error : ', error);    
})