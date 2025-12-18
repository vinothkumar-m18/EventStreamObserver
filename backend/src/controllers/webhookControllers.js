import WebhookEvent from '../models/WebhookEvent.js';
import WebhookSource from '../models/WebHookSource.js';

export const handleWebhook = async (req, res)=>{
    try{
        console.log('incoming webhook ', req.body);
        const endPointPath = req.params.endPointPath;
        
        let source = await WebhookSource.findOne({endPointPath});
        if(!source){
            source = await WebhookSource.create({
                user:'test-user',
                service:'custom',
                endPointPath,
                eventsAccepted:[],
                eventsReceived:0,
                active:true
            });
        }
        const payload = req.body;
        // save event
        const headers = req.headers;
        const event = await WebhookEvent.create({
            source:source._id,
            payload,
            headers,
            eventType:headers['x-event-type'] || 'unknown',
            ipAddress:req.ip,
            status:'received'        
        });
        source.eventsReceived += 1;
        await source.save();
        return res.status(200).json({
            message:'webhook received successfully',
            eventId:event._id
        });

    }catch(error){
        console.log('webhook error', error);        
        return res.status(500).json({message:'internal server error'});
    }
}