import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongooseAggregatePaginate"
const videoSchema = new mongoose.Schema({
    videoFIle:{
        type:String,//Cloudinary URL
        required:true
    },
    thumbnail:{
        type:String,//Cloudinary URL
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,////Cloudinary URL
        required:true
    },
    views:
    {
        type:Number,
        default:0
    },
    ispublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video","videoSchema")