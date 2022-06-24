import * as mongoose from "mongoose";
import { model } from "mongoose";

const taskSchema = new mongoose.Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "user"},
  teamId:{type: mongoose.Types.ObjectId,default:null, ref: "team" },
  memberId:[{type: mongoose.Types.ObjectId,default:null, ref: "user" }],
  projectId:{type: mongoose.Types.ObjectId,default:null, ref: "work"},
    comment:{type:String},
    image:{type:String},
  isDeleted:{type:Boolean, required: false},
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
});

export default model("discussion", taskSchema);
