import WebhookEvent from '../models/WebhookEvent.js';
import WebhookSource from '../models/WebhookSource.js';
import logger from '../utils/logger.js';

export const getUserEvents = async (req, res) => {
    try {
        const userId = req.userId;
        const sources = await WebhookSource.find({ user: userId }).select('_id');
        const sourceIds = sources.map(src => src._id);
        const events = await WebhookEvent.find({ source: { $in: sourceIds } })
            .sort({ createdAt: -1 })
            .limit(200)
            .populate({
                path: 'source',
                select: 'service user',
                populate: {
                    path: 'user',
                    select: 'email'
                }
            });

        logger.info('User events fetched successfully', {
            userId,
            eventCount: events.length
        });

        return res.status(200).json({ events });
    } catch (error) {
        logger.error('Error fetching events by user', {
            message: error.message,
            stack: error.stack,
            userId: req.userId
        });
        return res.status(500).json({ message: 'internal server error' });
    }
};

export const getEventsBySource = async (req, res) => {
    try {
        const source = req.params.sourceId;
        if (!source) {
            logger.warn('Event lookup attempted without source ID', {
                userId: req.userId
            });
            return res.status(404).json({ message: 'source not found' });
        }

        const events = await WebhookEvent.find({ source }).sort({ createdAt: -1 }).limit(200);
        logger.info('Source events fetched successfully', {
            sourceId: source,
            eventCount: events.length
        });

        return res.status(200).json({ events });
    } catch (error) {
        logger.error('Error returning events by source', {
            message: error.message,
            stack: error.stack,
            sourceId: req.params.sourceId
        });
        return res.status(500).json({ message: 'internal server error' });
    }
};

export const getSingleEvent = async (req, res) => {
    try {
        const event = await WebhookEvent.findById(req.params.eventId).populate('source');
        if (!event) {
            logger.warn('Requested event not found', {
                eventId: req.params.eventId
            });
            return res.status(404).json({ message: 'event not found' });
        }

        logger.info('Single event fetched successfully', {
            eventId: event._id,
            sourceId: event.source?._id
        });

        return res.status(200).json({
            message: 'event fetch successful',
            event
        });
    } catch (error) {
        logger.error('Error fetching single event', {
            message: error.message,
            stack: error.stack,
            eventId: req.params.eventId
        });
        return res.status(500).json({ message: 'internal server error' });
    }
};

export const filterEvents = async (req, res) => {
    try {
        const { eventType, status, source } = req.query;
        const query = {};
        if (eventType) query.eventType = eventType;
        if (status) query.status = status;
        if (source) query.source = source;

        const events = await WebhookEvent.find(query).sort({ createdAt: -1 }).limit(200);

        logger.info('Filtered events retrieved', {
            filters: { eventType, status, source },
            eventCount: events.length
        });

        return res.status(200).json({
            message: 'event filter successful',
            events
        });
    } catch (error) {
        logger.error('Filter error', {
            message: error.message,
            stack: error.stack,
            query: req.query
        });
        return res.status(500).json({ message: 'internal server error' });
    }
};