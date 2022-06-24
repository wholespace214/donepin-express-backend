import * as mongoose from "mongoose";
import { model } from "mongoose";

const leaveSchema = new mongoose.Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "user"},
  teamId:{type: mongoose.Types.ObjectId,default:null, ref: "team" },
  memberId:{type: mongoose.Types.ObjectId,default:null, ref: "user" },
  reason:{type:String,default: ""},
  leaveDate:{type:Date,default:new Date()},
  returnDate:{type:Date,default:new Date()},
  usedLeaveDays:{type:Number},
  totalLeftDays:{type:Number},
  totalLeaves:{type:Number},
  leaveType:[ {type: String}],
  status:{type:String,enum:["APPROVED","REJECTED","PENDING"], default:"PENDING"},
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

export default model("leave", leaveSchema);
