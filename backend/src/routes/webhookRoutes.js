import express from 'express';
import { handleWebhook } from '../controllers/webhookControllers.js';
const router = express.Router();
router.post('/:endPointPath', handleWebhook);
export default router;