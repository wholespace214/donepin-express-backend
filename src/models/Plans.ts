import { timeStamp } from "console";
import * as mongoose from "mongoose";
import { model } from "mongoose";

 const planSchema = new mongoose.Schema({

    planName:{type:String },
    versionName:{type:String},
    discription:{type:String},
    status:{ type:String ,default:"", enum: ["", "ACTIVE","INACTIVE", "DISABLED"] },
    price:{type:Number},
    
 
})
timeStamp
export default model("plan",planSchema)