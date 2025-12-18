import WebHookSource from "../models/WebHookSource.js";
export const getAllSources = async (req, res)=>{
    try{
        const sources = await WebHookSource.find().sort({createdAt:-1});
        return res.status(200).json(sources);
    }catch(error){
        console.log('error fetching sources ', error);
        return res.status(500).json({message:'internal server error'});
    }
};
export const getSourceBYId = async (req, res)=>{
    try{        
        const source = await WebHookSource.findById(req.params.sourceId);
        if(!source){
            return res.status(404).json({message:'webhook source not found'});
        }
        return res.status(200).json(source);
    }catch(error){
        console.log('error fetching the source ', error);
        return res.status(500).json({message:'internal server error'});
    }
};
export const toggleSource = async (req, res)=>{
    try{
        const source = await WebHookSource.findById(req.params.sourceId);
        if(!source){
            return res.status(404).json({message:'webhook source not found'});
        };
        source.active = !source.active;
        await source.save();
        return res.status(200).json(
            {
                message:'source updated',
                active:source.active
            }
        );
    }catch(error){
        console.log('toggle error ', error);
        return res.status(500).json({message:'internal server error'});
    }
};