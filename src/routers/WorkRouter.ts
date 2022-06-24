import { Router } from "express";
import { WorkController } from "../controllers/WorkController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWares";
import { TaskValidator } from "../validators/TaskValidator";
import { TeamValidator } from "../validators/TeamValidator";
import { WorkValidator } from "../validators/WorkValidator";

class WorkRouter {
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
      "/getProjectDetail/:projectId",
      GlobalMiddleWare.authenticate,
      WorkValidator.getProjectById(),
      GlobalMiddleWare.checkError,
      WorkController.getProjectById
    );

    this.router.get(
      "/getProject",
      GlobalMiddleWare.authenticate,
      GlobalMiddleWare.checkError,
      WorkController.getProject
    );
  }

  postRoutes() {
    this.router.post(
      "/createWorkProject/:TeamId",
      GlobalMiddleWare.authenticate,
     TeamValidator.getTeamById(),
      GlobalMiddleWare.checkError,
      WorkController.createWorkProject
    );
  }
  patchRoutes() {
    this.router.patch(
      "/editProject/:projectId",
      GlobalMiddleWare.authenticate,
      WorkValidator.getProjectById(),
      GlobalMiddleWare.checkError,
      WorkController.editMember
    );

    // this.router.patch(
    //   "/editProjectVisibility/:_id",
    //   GlobalMiddleWare.authenticate,
    //   GlobalMiddleWare.checkError,
    //   WorkController.editMember
    // );
  }
  deleteRoutes() {}
}

export default new WorkRouter().router;
