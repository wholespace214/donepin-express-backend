import * as mongoose from "mongoose";
import { model } from "mongoose";

const attendanceSchema = new mongoose.Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "user"},
  AttendanceType: { type: String, required: true,default: "NON PROJECT", enum: ["PROJECT BASED", "NON PROJECT"]},
  teamId:{type: mongoose.Types.ObjectId,default:null, ref: "team" },
  memberId:{type: mongoose.Types.ObjectId,default:null, ref: "user" },
  selectProject: { type: mongoose.Types.ObjectId, ref:"work" },
  selectTask: { type: mongoose.Types.ObjectId,ref:"task"},
  leaveId:{type: mongoose.Types.ObjectId,ref:"leave"},
  holidayId:{type: mongoose.Types.ObjectId,ref:"holiday"},
  comment:{type:String,default: ""},
  // selectDate:{type:Date,default:new Date()},
  checkIn:{type:Date,default:new Date()},
  checkOut:{type:Date,default:new Date()},
  pause:{type:Date,default:new Date()},
  resume:{type:Date,default:new Date()},
  break:{type:String},
  totalTimeDuration:{type:String},
  workingTime: {
    type: String,
    enum: ["", "FULL TIME", "PART TIME"],
    default: "FULL TIME",
  },
  hoursPerWeek: { type: Number, default: 0 },
  approvalStatus:{type:String, default:"PENDING",enum:["APPROVED","PENDING","REJECTED"]},
  workingDays: { type: Number, default: 0, max: 7 },
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

export default model("attendance", attendanceSchema);
