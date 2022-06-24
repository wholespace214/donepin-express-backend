import * as mongoose from "mongoose";
import { model } from "mongoose";

const holidaySchema = new mongoose.Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "user"},
  teamId:{type: mongoose.Types.ObjectId,default:null, ref: "team" },
  beginDate:[{type:Date,default:new Date()}],
  endDate:[{type:Date,default:new Date()}],
  totalholidays:{type:Number},
  holidayType:{type:String},
  occasion:{type:String},
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

export default model("holiday", holidaySchema);
