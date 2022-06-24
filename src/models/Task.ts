import * as mongoose from "mongoose";
import { model } from "mongoose";

const taskSchema = new mongoose.Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "user"},
  teamId:{type: mongoose.Types.ObjectId,default:null, ref: "team" },
  memberId:[{type: mongoose.Types.ObjectId,default:null, ref: "user" }],
  projectId:{type: mongoose.Types.ObjectId,default:null, ref: "work"},
  dependencies:[{type: mongoose.Types.ObjectId,default:null, ref: "task"}],
  taskName:{type:String,required:true},
  startDate:{type:Date,default:new Date()},
  endDate:{type:Date,default:new Date()},
  totalHours:{type:Number},
  section:{type:String},                       
  status:{type:String,required:true,default:" ",enum:[" ","WORKING","FINISHED","ON HOLD","CANCELED","UNDER REVIEW","NOT STARTED"]},
  priority:{type:String,required:true,default:" ", enum:[" ","HIGH","MEDIUM","LOW","HIGHEST"]},
  description:{type:String},
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

export default model("task", taskSchema);
