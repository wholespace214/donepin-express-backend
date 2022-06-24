import * as mongoose from "mongoose";
import { model } from "mongoose";

const groupSchema = new mongoose.Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "user",required: true},
  groupName: { type: String, required: true },
  teamId:{type: mongoose.Types.ObjectId,default:null, ref: "team" },
  groupMemberId: { type: mongoose.Types.ObjectId, ref: "user" },
  groupMemberRole:{type:String,default: ""},
  groupMemberStatus: {
    type: String,
    default: "DISABLED",
    enum: ["", "ACTIVE", "DISABLED"],
  },
  roleAccess: {
    isView: { type: Boolean, default: true },
    isManage: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isTeam: { type: Boolean, default: false },
  },
  groupAdminAccess: { type: Boolean, default: false },
  isDeleted:{type:Boolean, required: false},
  status: { type: String, default: "", enum: ["", "ACTIVE", "DISABLED"] },
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
});

export default model("group", groupSchema);
