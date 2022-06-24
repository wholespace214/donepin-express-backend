import { body, query, param } from "express-validator";
import Attendance from "../models/Attendance";

export class AttendanceValidator {
  static editMemberAttendance() {
    return [
      param("_id", "_id is required").custom((_id, { req }) => {
        return Attendance.findOne({ _id: _id }).then((attendance) => {
          if (attendance) {
            req.attendance = attendance;
          } else {
            throw new Error("Invalid Attendance Id");
          }
        });
      }),

      param("memberId", "memberId is required").custom((memberId, { req }) => {
        return Attendance.findOne({ memberId: memberId }).then((member) => {
          if (member) {
            req.member = member;
          } else {
            throw new Error("Invalid member Id");
          }
        });
      }),
    ];
  }
}
