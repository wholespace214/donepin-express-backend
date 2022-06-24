import * as mongoose from "mongoose";
import { model } from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: {
    type: String,
    required: true,
    default: "http://localhost:9071/src/uploads/logo.jpg",
  },
  role: {
    type: String,
    default: "",
    enum: ["","GUEST", "EMPLOYEE", "ADMIN", "CLIENT", "SUPERADMIN", "MANAGER"],
  },
  roleAccess: {
    isView: { type: Boolean, default: true },
    isManage: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isTeam: { type: Boolean, default: false },
  },
  subscription:[{type: mongoose.Types.ObjectId,default:null, ref: "plan" }],
  isAdminAccess: { type: Boolean, default: false },
  status: { type: String, default: "", enum: ["", "ACTIVE", "DISABLED"] },
  isMember: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, required: true, default: false },
  emailVerificationToken: { type: Number, required: true },
  emailVerificationTokenTime: { type: Date, required: true },
  resetPasswordToken: { type: Number, required: false },
  resetPasswordTokenTime: { type: Date, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
});
export default model("user", userSchema);
