import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    location:{
        type:{type:String, default:"Point"},
        coordinates:[Number],
        required:true,
    },
    description:{
        type:String,
        required:true,
        default:"",
    },
    image:{
        type:String,// cloudinary url
        required:true,
    },
    tags:{ //Sanitaion,similar
        type:[String],
    },
    address:{//MANUALLY 
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    approvedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required:true,
    },
    progress:{
        type:String,
        enum:["Pending","In progress","Completed"],
        required:true,
        default:"Pending",
    },
    votes:{
        type:Number,
        required:true,
        default:0,
    },
    priority:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"AiLog",
        required:true,
    },
},{timestamps:true});
IssueSchema.index({location:"2dsphere"})

export const Issue = mongoose.model("Issue",IssueSchema);
