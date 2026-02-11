import WebhookEvent from '../models/WebhookEvent.js';
import WebhookSource from '../models/WebhookSource.js';
import {io} from '../server.js';

import { verifyGithubSignature } from '../utils/verifyGithubSignature.js';
export const handleWebhook = async (req, res) => {
    try {
        const endPointPath = req.params.endPointPath;

        let source = await WebhookSource.findOne({ endPointPath, active:true});
        if(!source){
            return res.status(404).json({message:'invalid webhook endpoint'});        
        }
        if(source.service === 'github'){
            const signature = req.headers['x-hub-signature-256'];
            if(!signature){
                console.log('no signature header found github');
                return res.status(400).json({msg:'missing github signature header'});
            }
            console.log('source.secret: ', source.secret);
            const isValid = verifyGithubSignature(source.secret, JSON.stringify(req.body), signature);
            if(!isValid){
                return res.status(401).json({msg:'invalid github signature'});
            }
        }

        const payload = req.body;
        // save event
        const headers = req.headers;
        const event = await WebhookEvent.create({
            source: source._id,
            payload,
            headers,
            eventType: headers['x-github-event'] || headers['x-event-type'] || 'unknown',
            ipAddress: req.ip,
            status: 'received'
        });
        const populatedSource = await source.populate('user', 'email');
        io.emit('new-event', {
            id:event._id,
            eventType:event.eventType,
            payload:event.payload,
            source:{
                service:populatedSource.service,
                user:{email:populatedSource.user.email}
            },
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