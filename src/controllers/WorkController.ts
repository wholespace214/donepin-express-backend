import Work from "../models/Work";
import * as moment from "moment";

export class WorkController {
  static async createWorkProject(req, res, next) {
    const adminId = req.user._id;
    const { projectName, color, visibility } = req.body;

    const data = {
      adminId: adminId,
      projectName: projectName,
      color: color,
      visibility: visibility,
    };
    try {
      const project = await Work.findOne({
        adminId: adminId,
        projectName: projectName,
      });
      console.log(project);
      if (project) {
        throw new Error("Project is already available with this name");
      } else {
        const doc = await new Work(data).save();
        res.status(200).json({
          Status_code: 200,
          message: "create work project",
          data: doc,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  static async editMember(req, res, next) {
    const adminId = req.user._id;
    const projectId = req.project.id;
    const {
      projectName,
      color,
      startDate,
      endDate,
      progress,
      status,
      priority,
      description,
      visibility
    } = req.body;
    const { teamId, memberId } = req.body;
    try {
      const project = await Work.findOneAndUpdate(
        { adminId: adminId, _id: projectId },
        {
          $addToSet: { teamId: teamId, memberId: memberId },
          color: color,
          projectName: projectName,
          startDate: startDate,
          endDate: endDate,
          priority: priority,
          description: description,
          progress: progress,
          status: status,
          visibility: visibility || 'MEMBERS'
        },
        { new: true }
      );
      if (project) {
        res.status(200).json({
          Status_code: 200,
          message: "updated work project",
          data: project,
        });
      } else {
        throw new Error("Project Does Not Exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async getProjectById(req, res, next) {
    const adminId = req.user._id;
    const projectId = req.project.id;
    console.log(projectId);
    try {
      const check = await Work.findOne({ adminId: adminId, _id: projectId });
      if (check) {
        res.status(200).json({
          Status_code: 200,
          message: "updated work project",
          data: check,
        }); 
      }else{
        throw new Error("Project does not exist");
      }
    } catch (e) {
      next("workController : getProjectById : ->", e);
    }
  }

  static async getProject(req, res, next) {
    const adminId = req.user._id;
    try {
      const check = await Work.find({ adminId: adminId });
      if (check) {
        res.status(200).json({
          Status_code: 200,
          message: "updated work project",
          data: check,
        }); 
      }else{
        throw new Error("Project list for this admin does not exist");
      }
    } catch (e) {
      next("workController : getProjectById : ->", e);
    }
  }
}
