import express from 'express';
import { createSource, getSourcesByUser, getAllSources, getSourceBYId, toggleSource} from '../controllers/webhookSourceController.js';
const router = express.Router();
router.post('/', createSource);
router.get('/my', getSourcesByUser);
router.get('/all', getAllSources);
router.get('/:sourceId', getSourceBYId);
router.put('/:sourceId', toggleSource);
export default router;