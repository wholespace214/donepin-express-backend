import * as mongoose from "mongoose";
import { model } from "mongoose";

const companySchema = new mongoose.Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "user" },
  teamId: { type: mongoose.Types.ObjectId, default: null, ref: "team" },
  companyName: { type: String},
  email: { type: String},
  phoneNo: {type:Number},
  website: { type: String},
  ceoName: { type: String},
  Address: { type: String},
  companyRegistration: { type: String},
  BankName: { type: String},
  IBAN: { type: String},
  BIC:{ type: String},
  logo: { type:String},
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

export default model("company", companySchema);
