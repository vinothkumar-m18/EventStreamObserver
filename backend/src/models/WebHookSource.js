import mongoose from 'mongoose';
const webhookSourceSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    service:{
        type:String,
        required:true,
        enum:['github', 'stripe', 'notion', 'slack', 'custom']
    },
    endPointPath:{
        type:String,
        required:true,
        unique:true
    },
    eventsAccepted:{
        type:[String],
        default:[]
    },
    active:{
        type:Boolean,
        default:true
    }    
},
{timeStamps:true});
export default mongoose.model("WebhookSource", webhookSourceSchema);