import * as mongoose from "mongoose";
import { model } from "mongoose";

const taxSchema = new mongoose.Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "user" },
  teamId: { type: mongoose.Types.ObjectId, default: null, ref: "team" },
  Name:{type:String},
  rate:{type:Number},
  isDeleted: { type: Boolean, required: false },
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
});

export default model("tax", taxSchema);
