import Task from "../models/Task";
import TaskFile from "../models/TaskFile";
import * as moment from "moment";

export class TaskController {
  static async createTaskProject(req, res, next) {
    const adminId = req.user._id;
    const projectId = req.project.id;
    const teamId = req.team.id;

    const {
      taskName,
      startDate,
      endDate,
      dependencies,
      section,
      status,
      priority,
      description,
      memberId,
      taskId,
    } = req.body;

    const data = {
      taskName,
      startDate,
      endDate,
      dependencies,
      section,
      status,
      priority,
      description,
      memberId,
      taskId,
      teamId,
      projectId,
    };

    try {
      const project = await Task.findOne({
        adminId: adminId,
        teamId: teamId,
        taskName: taskName,
        projectId: projectId,
      });
      console.log(project);
      if (project) {
        throw new Error("Task is already available with this name");
      } else {
        const doc = await new Task(data).save();
        res.status(200).json({
          Status_code: 200,
          message: "create task project",
          data: doc,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  static async getTask(req, res, next) {
    const adminId = req.user._id;
    try {
      const check = await Task.find({ adminId: adminId });
      if (check) {
        res.status(200).json({
          Status_code: 200,
          message: "task list",
          data: check,
        });
      } else {
        throw new Error("Task list for this admin does not exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async getTaskDetail(req, res, next) {
    const adminId = req.user._id;
    const projectId = req.project.id;
    const teamId = req.team.id;
    const taskId = req.task.id;
    try {
      const check = await Task.findOne({
        adminId: adminId,
        projectId: projectId,
        teamId: teamId,
        taskId: taskId,
      });
      if (check) {
        res.status(200).json({
          Status_code: 200,
          message: "task detail",
          data: check,
        });
      } else {
        throw new Error("Task does not exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async getTaskAssigned(req, res, next) {
    const adminId = req.user._id;
    const projectId = req.project.id;
    const teamId = req.team.id;
    try {
      const check = await Task.find({
        adminId: adminId,
        projectId: projectId,
        teamId: teamId,
        memberId:req.query.memberId
      });
      if (check) {
        res.status(200).json({
          Status_code: 200,
          message: "task Assigned to this user",
          data: check,
        });
      } else {
        throw new Error("Task does not exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async editTask(req, res, next) {
    const adminId = req.user._id;
    const projectId = req.project.id;
    const teamId = req.team.id;
    const taskId = req.task.id;

    const {
      taskName,
      startDate,
      endDate,
      dependencies,
      section,
      status,
      priority,
      description,
      memberId,
    } = req.body;
    try {
      const project = await Task.findOneAndUpdate(
        { adminId: adminId, projectId: projectId, teamId: teamId ,_id:taskId},
        {
          $addToSet: { memberId: memberId, dependencies: dependencies },
          startDate: startDate,
          endDate: endDate,
          priority: priority,
          description: description,
          status: status,
          taskName: taskName,
          section: section,
        },
        { new: true }
      );
      if (project) {
        res.status(200).json({
          Status_code: 200,
          message: "updated task ",
          data: project,
        });
      } else {
        throw new Error("task Does Not Exist");
      }
    } catch (e) {
      next(e);
    }
  }



  // task member will upload the task file to the server
  
  static async fileUpload(req, res, next) {
    const userId = req.user._id;
    const projectId = req.project.id;
    const teamId = req.team.id;
    const searchPath = req.file.path;
    const filename = req.file.originalname;
    const replacePath = "src/uploads/" + filename;

    const newPath = searchPath.replace(searchPath, replacePath);
      console.log(req.file);
    const fileUrl = `http://localhost:8001/${newPath}`;
    const Data = {
      uploadedBy: userId,
      projectId: projectId,
      teamId: teamId,
      file : fileUrl,
      fileType:req.file.mimetype,
      remaineSize: 104857600 - req.file.size,
      createdAt : new Date(),
      updatedAt : new Date()
  };
    try {
      const check = await TaskFile.find({file:fileUrl});
      if(check){
res.send("file is already available with this name");
      }else{
        const project = await new TaskFile(Data).save();
      res.send(project);
      }
      
    } catch (e) {
      next(e);
    }
  }


  static async getFiles(req, res, next) {
    const userId = req.user._id;
    const projectId = req.project.id;
    const teamId = req.team.id;
    try {
      const project = await TaskFile.find({uploadedBy:userId, projectId:projectId,teamId:teamId});
      res.send(project);
    } catch (e) {
      next(e);
    }
  }


}
