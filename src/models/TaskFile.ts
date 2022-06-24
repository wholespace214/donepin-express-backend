import * as mongoose from "mongoose";
import { model } from "mongoose";

const taskfileSchema = new mongoose.Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "user"},
  teamId:{type: mongoose.Types.ObjectId,default:null, ref: "team" },
  uploadedBy:{type: mongoose.Types.ObjectId,default:null, ref: "user" },
  projectId:{type: mongoose.Types.ObjectId,default:null, ref: "work"},
  plan:{type:String,default:'free'},
  file:{type:String,default:""},
  fileType:{type:String,default: ""},
  fileSizelimit:{type:Number,default: 104857600},
  remaineSize:{type:Number,default:0},
  status:{type:String},
  isDeleted:{type:Boolean, required: false},
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
});

export default model("taskfile", taskfileSchema);
