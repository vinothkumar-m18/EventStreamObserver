import mongoose from 'mongoose';
const webhookEventSchema = new mongoose.Schema({
    source:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'WebhookSource',
        required:true
    },
    eventType:{
        type:String,
        required:true
    },
    payload:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
    headers:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    },
    ipAddress:{
        type:String,
        default:null
    },
    status:{
        type:String,
        enum:['received', 'processed', 'failed'],
        default:'received'
    },
    errorMessage:{
        type:String,
        default:null
    },   
},{timestamps:true});
export default mongoose.model('WebhookEvent', webhookEventSchema);