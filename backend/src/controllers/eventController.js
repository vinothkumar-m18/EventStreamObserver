import WebhookEvent from '../models/WebhookEvent.js';
import WebhookSource from '../models/WebhookSource.js';
export const getUserEvents = async (req, res)=>{
    try{
        const {userId} = req.userId;
        const sources = await WebhookSource.find({user:userId}).select('_id');
        const sourceIds = sources.map(src => src._id);
        const events = await WebhookEvent.find({source:{$in:sourceIds}})    
            .sort({createdAt:-1})
            .limit(200)
            .populate({
                path:'source',
                select:'service user'
            });
        return res.status(200).json({events});
    }catch(error){
        console.log('error fetching events by user: ', error);
        return res.status(500).json({message:'internal server error'});
    }    
};
export const getEventsBySource = async (req, res)=>{
    try{
        const source = req.params.sourceId;
        if(!source){
            return res.status(404).json({message:'source not found'});
        }
        const events = await WebhookEvent.find({source}).sort({createdAt:-1}).limit(200);
        return res.status(200).json({events});
    }catch(error) {
        console.log('error returning events ', error);
        return res.status(500).json({message:'internal server error'});
    }
};
export const getSingleEvent = async (req, res) =>{
    try{
        const event = await WebhookEvent.findById(req.params.eventId).populate('source');
        if(!event){
            return res.status(404).json({message:'event not found'});
        }
        return res.status(200).json({
            message:'event fetch successful',
            event
        });
    }catch(error){
        console.log('error fetching event ', error);
        return res.status(500).json({message:'internal server error'});
    }
};
export const filterEvents = async (req, res)=>{
    try{
        const {eventType, status, source} = req.query;
        const query = {};
        if(eventType) query.eventType = eventType;
        if(status) query.status = status;
        if(source) query.source = source;
        const events = await WebhookEvent.find(query).sort({createdAt:-1}).limit(200);
        return res.status(200).json({
            message:'event filter successful',
            events
        });
    }catch(error){
        console.log('filter error ', error);
        return res.status(500).json({message:'internal server error'});
    }
};