import express from 'express';
import { getAllSources, getSourceBYId, toggleSource} from '../controllers/webhookSourceController.js';
const router = express.Router();
router.get('/', getAllSources);
router.get('/:sourceId', getSourceBYId);
router.put('/:sourceId', toggleSource);
export default router;