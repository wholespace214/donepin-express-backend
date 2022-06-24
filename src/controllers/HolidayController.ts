import User from "../models/User";
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/NodeMailer";
import Team from "../models/Team";
import Group from "../models/Group";
import Attendance from "../models/Attendance";
import Leave from "../models/Leave";
import Holiday from "../models/Holiday";

export class HolidayController {
  static async createHoliday(req, res, next) {
    try {
      const adminId = req.user._id;
      const teamId = req.team;
      const beginDate = req.body.beginDate;
      const endDate = req.body.endDate;
      const occasion = req.body.occasion;
      const doc = {
        adminId,
        teamId,
        beginDate,
        endDate,
        occasion,
      };

      const data = await new Holiday(doc).save();
      res.status(200).json({
        Status_code: 200,
        message: "Holiday Added",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAllHoliday(req, res, next) {
    try {
      const adminId = req.user._id;

      const doc = await Holiday.find({ adminId: adminId });
      if (doc) {
        res.status(200).json({
          Status_code: 200,
          message: "All Members Holiday",
          data: doc,
        });
      } else {
        throw new Error("Cannot get all members");
      }
    } catch (err) {
      next(err);
    }
  }
}
