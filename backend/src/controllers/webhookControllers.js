import WebhookEvent from '../models/WebhookEvent.js';
import WebhookSource from '../models/WebhookSource.js';
import {io} from '../server.js';

export const handleWebhook = async (req, res) => {
    try {
        const endPointPath = req.params.endPointPath;

        let source = await WebhookSource.findOne({ endPointPath, active:true});
        if(!source){
            return res.status(404).json({message:'invalid webhook endpoint'});
        }
        const payload = req.body.payload;
        // save event
        const headers = req.headers;
        const event = await WebhookEvent.create({
            source: source._id,
            payload,
            headers,
            eventType: headers['x-event-type'] || 'unknown',
            ipAddress: req.ip,
            status: 'received'
        });
        io.emit('new-event', {
            id:event._id,
            eventType:event.eventType,
            payload:event.payload,
            source:source.service,
            createdAt:event.createdAt
        });
        console.log('event emitted');
        source.eventsReceived += 1;
        await source.save();
        return res.status(200).json({
            message: 'webhook received successfully',
            eventId: event._id
        });

    } catch (error) {
        console.log('webhook error', error);
        return res.status(500).json({ message: 'internal server error' });
    }
}