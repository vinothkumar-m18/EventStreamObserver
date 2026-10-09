import WebhookEvent from '../models/WebhookEvent.js';
import WebhookSource from '../models/WebhookSource.js';
import logger from '../utils/logger.js';
import verifyGithubSignature from '../utils/verifyGithubSignature.js';

export const handleWebhook = async (req, res) => {
    try {
        const endPointPath = req.params.endPointPath;
        const source = await WebhookSource.findOne({ endPointPath, active: true });

        if (!source) {
            logger.warn('Webhook received for unknown or inactive endpoint', { endPointPath });
            return res.status(404).json({ message: 'invalid webhook endpoint' });
        }

        if (source.service === 'github') {
            const signature = req.headers['x-hub-signature-256'];
            if (!signature) {
                logger.warn('GitHub webhook signature missing', {
                    sourceId: source._id,
                    endPointPath
                });
                return res.status(400).json({ msg: 'missing github signature header' });
            }

            const isValid = verifyGithubSignature(source.secret, JSON.stringify(req.body), signature);
            if (!isValid) {
                logger.warn('GitHub webhook signature verification failed', {
                    sourceId: source._id,
                    endPointPath
                });
                return res.status(401).json({ msg: 'invalid github signature' });
            }
        }

        const payload = req.body;
        const headers = req.headers;
        const event = await WebhookEvent.create({
            source: source._id,
            payload,
            headers,
            eventType: headers['x-github-event'] || headers['x-event-type'] || 'unknown',
            ipAddress: req.ip,
            status: 'received'
        });

        logger.info('Webhook event stored successfully', {
            eventId: event._id,
            sourceId: source._id,
            eventType: event.eventType
        });

        const populatedSource = await source.populate('user', 'email');
        const io = req.app.get('io');
        if (io) {
            io.emit('new-event', {
                _id: event._id,
                eventType: event.eventType,
                payload: event.payload,
                source: {
                    service: populatedSource.service,
                    user: { email: populatedSource.user.email }
                },
                createdAt: event.createdAt
            });
            logger.info('Webhook event emitted to socket clients', {
                eventId: event._id,
                sourceId: source._id
            });
        } else {
            logger.warn('Socket.IO instance not present on request app', {
                endPointPath,
                sourceId: source._id
            });
        }

        source.eventsReceived += 1;
        await source.save();

        return res.status(200).json({
            message: 'webhook received successfully',
            eventId: event._id
        });

    } catch (error) {
        logger.error('Webhook processing failed', {
            message: error.message,
            stack: error.stack,
            endPointPath: req.params.endPointPath,
            ipAddress: req.ip
        });
        return res.status(500).json({
            message: 'internal server error',
            error: error.message
        });
    }
};