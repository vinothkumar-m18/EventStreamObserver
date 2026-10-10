import express from 'express';
import { handleWebhook } from '../controllers/webhookControllers.js';
import { webhookSchema } from '../schemas/webhookSchema.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();
router.post('/:endPointPath', validate(webhookSchema), handleWebhook);
export default router;