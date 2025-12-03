import mongoose from 'mongoose';
const eventSchema = new mongoose.Schema({
    source:{
        type:mongoose.Schema.Type.ObjectId,
        ref:'WebhookSource',
        required:true
    },
    eventType:{
        type:String,
        required:true
    },
    payload:{
        type:Object,
        required:true
    }
},
{timestamps:true});
export default mongoose.model("Event", eventSchema);