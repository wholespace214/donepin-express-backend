import Attendance from "../models/Attendance";
import * as moment from "moment";

export class AttendanceController {
  static async editMemberAttendance(req, res, next) {
    const adminId = req.user._id;
    const attendance = req.attendance;
    const member = req.member;
    try {
      const doc = await Attendance.findOneAndUpdate(
        { adminId: adminId, _id: attendance._id ,memberId: member._id},
        { ...req.body, updatedAt: Date.now() },
        { new: true }
      );
      res.status(200).json({
        Status_code: 200,
        message: "edit Member Attendance",
        data: doc,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getAllMemberAttendance(req, res, next) {
    try {
      const adminId = req.user._id;

      const doc = await Attendance.find({ adminId: adminId });
      if (doc) {
        res.status(200).json({
          Status_code: 200,
          message: "All Members Attendance",
          data: doc,
        });
      } else {
        throw new Error("Cannot get all members");
      }
    } catch (err) {
      next(err);
    }
  }

  static async statusUpdateAttendance(req, res, next) {
    try{
      const member = req.member;
      const adminId = req.user._id;
      const attendance = req.attendance;
      const doc = await Attendance.findOneAndUpdate(
        { adminId: adminId, _id: attendance._id ,memberId: member._id},
        { approvalStatus:req.body.approvalStatus, updatedAt: Date.now() },
        { new: true }
      );
      res.status(200).json({
        Status_code: 200,
        message: "edit Member Attendance",
        data: doc,
      });
    }catch (err) {

    }
  }
}
