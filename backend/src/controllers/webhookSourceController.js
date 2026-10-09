import WebHookSource from '../models/WebhookSource.js';
import crypto from 'crypto';
import logger from '../utils/logger.js';

export const createSource = async (req, res) => {
    try {
        let { service, eventsAccepted } = req.body;

        if (!(service === 'github')) {
            if (!service || !Array.isArray(eventsAccepted) || eventsAccepted.length === 0) {
                logger.warn('Webhook source creation failed: missing service or accepted events', {
                    userId: req.userId,
                    service,
                    eventsAccepted
                });
                return res.status(401).json({ msg: 'fill service and events accepted fields' });
            }
        } else {
            eventsAccepted = ['push', 'pull_request', 'issues', 'release'];
        }

        const endPointPath = crypto.randomBytes(12).toString('hex');
        const secret = crypto.randomBytes(24).toString('hex');
        const source = await WebHookSource.create({
            user: req.userId,
            service,
            endPointPath,
            secret,
            eventsAccepted
        });

        logger.info('Webhook source created successfully', {
            userId: req.userId,
            sourceId: source._id,
            service: source.service,
            endpoint: source.endPointPath
        });

        return res.status(201).json({
            id: source._id,
            service: source.service,
            endpoint: `/webhook/${source.endPointPath}`,
            secret: source.secret,
            acceptedEvents: source.acceptedEvents
        });
    } catch (error) {
        logger.error('Error creating webhook source', {
            message: error.message,
            stack: error.stack,
            userId: req.userId
        });
        return res.status(500).json({ message: 'internal server error' });
    }
};

export const getSourcesByUser = async (req, res) => {
    try {
        const sources = await WebHookSource.find({ user: req.userId });

        logger.info('Fetched user webhook sources', {
            userId: req.userId,
            sourceCount: sources.length
        });

        return res.status(200).json(sources);
    } catch (error) {
        logger.error('Error fetching sources by user', {
            message: error.message,
            stack: error.stack,
            userId: req.userId
        });
        return res.status(500).json({ message: 'internal server error' });
    }
};

export const getAllSources = async (req, res) => {
    try {
        const sources = await WebHookSource.find().sort({ createdAt: -1 });

        logger.info('Fetched all webhook sources', {
            sourceCount: sources.length
        });

        return res.status(200).json(sources);
    } catch (error) {
        logger.error('Error fetching all sources', {
            message: error.message,
            stack: error.stack
        });
        return res.status(500).json({ message: 'internal server error' });
    }
};

export const getSourceBYId = async (req, res) => {
    try {
        const source = await WebHookSource.findById(req.params.sourceId);
        if (!source) {
            logger.warn('Webhook source lookup failed: source not found', {
                sourceId: req.params.sourceId
            });
            return res.status(404).json({ message: 'webhook source not found' });
        }

        logger.info('Fetched webhook source details', {
            sourceId: source._id,
            userId: source.user
        });

        return res.status(200).json(source);
    } catch (error) {
        logger.error('Error fetching the source', {
            message: error.message,
            stack: error.stack,
            sourceId: req.params.sourceId
        });
        return res.status(500).json({ message: 'internal server error' });
    }
};

export const toggleSource = async (req, res) => {
    try {
        const source = await WebHookSource.findById(req.params.sourceId);
        if (!source) {
            logger.warn('Webhook source toggle failed: source not found', {
                sourceId: req.params.sourceId
            });
            return res.status(404).json({ message: 'webhook source not found' });
        }

        source.active = !source.active;
        await source.save();

        logger.info('Webhook source toggled successfully', {
            sourceId: source._id,
            active: source.active,
            userId: source.user
        });

        return res.status(201).json({
            message: 'source updated',
            active: source.active
        });
    } catch (error) {
        logger.error('Toggle source error', {
            message: error.message,
            stack: error.stack,
            sourceId: req.params.sourceId
        });
        return res.status(500).json({ message: 'internal server error' });
    }
};