import mongoose from 'mongoose';
const webhookSourceSchema = new mongoose.Schema({
    user:{
        type:String,
        ref:"User",        
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
    eventsReceived:{
        type:Number,
        default:0
    },
    active:{
        type:Boolean,
        default:true
    }    
},
{timestamps:true});
export default mongoose.model("WebhookSource", webhookSourceSchema);