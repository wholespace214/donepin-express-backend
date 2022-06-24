import * as mongoose from "mongoose";
import { model } from "mongoose";

const clientSchema = new mongoose.Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "user" },
  teamId: { type: mongoose.Types.ObjectId, default: null, ref: "team" },
 
  Name:{type:String},
  email:{type:String},
  companyName:{type:String},
  phoneNo:{type:Number},
  address:{type:String},
  clientNumber:{type:Number},
  clientType:{type:String},
  roleAccess: {
    isView: { type: Boolean, default: true },
    isManage: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isTeam: { type: Boolean, default: false },
  },
  isDeleted: { type: Boolean, required: false },
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
});

export default model("client", clientSchema);
