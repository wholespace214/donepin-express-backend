import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWares";
import { Utils } from "../utils/Utils";
import { TaskValidator} from "../validators/TaskValidator";
import { TeamValidator } from "../validators/TeamValidator";
import { WorkValidator } from "../validators/WorkValidator";

class TaskRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
    this.deleteRoutes();
  }

  getRoutes() {
    this.router.get(
        "/getTask",
        GlobalMiddleWare.authenticate,
        GlobalMiddleWare.checkError,
        TaskController.getTask
      );

      this.router.get(
        "/getTaskDetail/:TeamId/:projectId/:taskId",
        GlobalMiddleWare.authenticate,
        TeamValidator.getTeamById(),
        WorkValidator.getProjectById(),
        TaskValidator.getTaskById(),
        GlobalMiddleWare.checkError,
        TaskController.getTaskDetail
      );

      this.router.get(
        "/getFiles/:TeamId/:projectId",
        GlobalMiddleWare.authenticate,
        TeamValidator.getTeamById(),
        WorkValidator.getProjectById(),
        GlobalMiddleWare.checkError,
        TaskController.getFiles
      );

      this.router.get(
        "/getTaskAssigned/:TeamId/:projectId",
        GlobalMiddleWare.authenticate,
        TeamValidator.getTeamById(),
        WorkValidator.getProjectById(),
        GlobalMiddleWare.checkError,
        TaskController.getTaskAssigned
      );
     

  }

  postRoutes() {
      this.router.post("/createTask/:TeamId/:projectId",
      GlobalMiddleWare.authenticate,
      TeamValidator.getTeamById(),
      WorkValidator.getProjectById(),
      TaskValidator.createTaskProject(),
      GlobalMiddleWare.checkError,
      TaskController.createTaskProject
      );
   
  }
  patchRoutes() {
    this.router.post("/editTask/:TeamId/:projectId/:taskId",
    GlobalMiddleWare.authenticate,
    TeamValidator.getTeamById(),
    WorkValidator.getProjectById(),
    TaskValidator.getTaskById(),
    GlobalMiddleWare.checkError,
    TaskController.editTask
    );

    this.router.post("/fileUpload/:TeamId/:projectId",
    GlobalMiddleWare.authenticate,
    new Utils().multer.single('file'),
    TeamValidator.getTeamById(),
    WorkValidator.getProjectById(),
    TaskValidator.addFile(),
    GlobalMiddleWare.checkError,
    TaskController.fileUpload
    );
   
  }
  deleteRoutes() {}
}

export default new TaskRouter().router;
