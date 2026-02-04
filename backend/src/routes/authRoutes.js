import {register, login} from '../controllers/authController.js';
import express from 'express';
const router = express.Router();
import protect from '../middlewares/protect.js';
router.get('/me', protect, (req, res)=>{
    res.json({msg:'token valid', userId:req.user});
});
router.post('/register', register);
router.post('/login', login);
export default router;
