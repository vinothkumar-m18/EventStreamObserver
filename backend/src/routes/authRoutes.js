import {register, login} from '../controllers/authController.js';
import express from 'express';
import protect from '../middlewares/protect.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema} from '../schemas/authSchema.js';
const router = express.Router();
router.get('/me', protect, (req, res)=>{
    res.json({msg:'token valid', userId:req.userId});
});
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
export default router;
