import * as mongoose from "mongoose";
import { model } from "mongoose";

const teamSchema = new mongoose.Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "user",default: null},
  memberEmail: { type: String, required: true },
  memberId: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
  memberJobRole: { type: String, default: "" },
  roleAccess: {
    isView: { type: Boolean, default: true },
    isManage: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isTeam: { type: Boolean, default: false },
  },
  teamAdminAccess:{type: Boolean, default: false},
  teamMemberStatus: {
    type: String,
    default: "DISABLED",
    enum: ["", "ACTIVE", "DISABLED"],
  },
  groupId: [{ type: mongoose.Types.ObjectId, ref: "group", default: null }],
  attendanceId:{type: mongoose.Types.ObjectId, ref: "attendance",default: null},
  teamVerificationToken: { type: Number, required: true },
  teamVerificationTokenTime: { type: Date, required: true },
  isMember: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
});
export default model("team", teamSchema);
