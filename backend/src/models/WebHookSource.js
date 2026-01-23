import mongoose, { Mongoose } from 'mongoose';
const webhookSourceSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",        
        required:true
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
    },
    secret:{
        type:String,
        required:true
    },
    providerMeta:{
        type:mongoose.Schema.Types.Mixed;
        default:{}
    }
},
{timestamps:true});
export default mongoose.model("WebhookSource", webhookSourceSchema);