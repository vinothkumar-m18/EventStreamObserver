import express from 'express';
import { getAllEvents, getEventsBySource, getSingleEvent, filterEvents} from '../controllers/eventController.js';
const router = express.Router();
router.get('/', getUserEvents);
router.get('/source/:sourceId', getEventsBySource);
router.get('/:eventId', getSingleEvent);
router.get('/filter', filterEvents);
export default router;