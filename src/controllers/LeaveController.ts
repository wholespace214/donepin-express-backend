import User from "../models/User";
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/NodeMailer";
import Team from "../models/Team";
import Group from "../models/Group";
import Attendance from "../models/Attendance";
import Leave from "../models/Leave";

export class LeaveController {
  static async createLeave(req, res, next) {
    try {
      const adminId = req.user._id;
      const memberId = req.member;
      const teamId = req.team;
      const totalLeaves = req.body.totalLeaves;

      const doc = {
        adminId,
        memberId,
        teamId,
        totalLeaves,
      };

     const data =  await new Leave(doc).save();
      res.status(200).json({
        Status_code: 200,
        message: "Leave Assign",
        data: data,
      })
    } catch (err) {
      next(err);
    }
  }

  static async getAllMemberLeaves(req,res, next){
      try{
            const adminId = req.user._id;

            const doc = await Leave.find({ adminId: adminId });
            if(doc){
                res.status(200).json({
                    Status_code: 200,
                    message: "All Members Leaves",
                    data: doc,
                  })
            }else{
                throw new Error("Cannot get all members");
            }

      }catch(err){
          next(err);
      }
  }
}
