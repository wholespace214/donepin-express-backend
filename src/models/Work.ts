import * as mongoose from "mongoose";
import { model } from "mongoose";

const workSchema = new mongoose.Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "user"},
  teamId:[{type: mongoose.Types.ObjectId,default:null, ref: "team" }],
  memberId:[{type: mongoose.Types.ObjectId,default:null, ref: "user" }],
  projectName:{type:String,required:true},
  startDate:{type:Date,default:new Date()},
  endDate:{type:Date,default:new Date()},
  progress:{type:String},                       
  status:{type:String,required:true,default:"NOT STARTED",enum:["WORKING","FINISHED","ON HOLD","CANCELED","UNDER REVIEW","NOT STARTED"]},
  priority:{type:String,required:true,default:"LOW", enum:["HIGH","MEDIUM","LOW"]},
  description:{type:String},
  color:{type:String},
  visibility:{type:String,required:true,default:"MEMBERS",enum:["MEMBERS","PUBLIC"]},
  roleAccess: {
    isView: { type: Boolean, default: true },
    isManage: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isTeam: { type: Boolean, default: false },
  },
  isDeleted:{type:Boolean, required: false},
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
});

export default model("work", workSchema);
