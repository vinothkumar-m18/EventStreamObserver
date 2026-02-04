import WebHookSource from "../models/WebhookSource.js";
import crypto from 'crypto';
export const createSource = async (req, res) => {
    try {
        let { service, eventsAccepted } = req.body;
        if(!(service === 'github')){
            if(!service || eventsAccepted.length === 0){
                console.log('service and events accepted fields cannot be empty');
                return res.status(401).json({msg:'fill service and event accepted fields'})
            }
        }else{
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
        console.log('source created');
        return res.status(201).json({
            id: source._id,
            service: source.service,
            endpoint: `/webhook/${source.endPointPath}`,
            secret: source.secret,
            acceptedEvents: source.acceptedEvents
        });
    } catch (error) {
        console.log('error creating source: ', error);
        return res.status(500).json({ message: 'internal server error' });
    }
};
export const getSourcesByUser = async (req, res) => {
    try {
        const sources = await WebHookSource.find({ user: req.userId });
        return res.status(200).json({ sources });
    } catch (error) {
        console.log('error fetching sources by user: ', error);
        return res.status(500).json({ message: 'internal server error' });
    }
};
export const getAllSources = async (req, res) => {
    try {
        const sources = await WebHookSource.find().sort({ createdAt: -1 });
        return res.status(200).json(sources);
    } catch (error) {
        console.log('error fetching sources ', error);
        return res.status(500).json({ message: 'internal server error' });
    }
};
export const getSourceBYId = async (req, res) => {
    try {
        const source = await WebHookSource.findById(req.params.sourceId);
        if (!source) {
            return res.status(404).json({ message: 'webhook source not found' });
        }
        return res.status(200).json(source);
    } catch (error) {
        console.log('error fetching the source ', error);
        return res.status(500).json({ message: 'internal server error' });
    }
};
export const toggleSource = async (req, res) => {
    try {
        const source = await WebHookSource.findById(req.params.sourceId);
        if (!source) {
            return res.status(404).json({ message: 'webhook source not found' });
        };
        source.active = !source.active;
        await source.save();
        return res.status(201).json(
            {
                message: 'source updated',
                active: source.active
            }
        );
    } catch (error) {
        console.log('toggle error ', error);
        return res.status(500).json({ message: 'internal server error' });
    }
};