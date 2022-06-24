import { body, query, param } from "express-validator";
import Task from "../models/Task";

export class TaskValidator {
  static getTaskById() {
    return [
      param("taskId", "taskId is required").custom((TaskId, { req }) => {
        return Task.findOne({ _id: TaskId }).then((task) => {
          if (task) {
            req.task = task;
          } else {
            throw new Error("Invalid task Id");
          }
        });
      }),
    ];
  }

  static createTaskProject() {
    return [body("taskName", "Task Name is required").isString()];
  }

  static addFile() {
    return [
      body("file").custom((file, { req }) => {
        console.log(req.file);
        if (req.file) {
          return true;
        } else {
          throw new Error("File not Uploaded");
        }
      })
    ];
  }
}
