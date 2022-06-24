import { Router } from "express";
import { DiscussionController } from "../controllers/DiscussionController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWares";
import { Utils } from "../utils/Utils";
import { DiscussionValidator } from "../validators/DiscussionValidator";
import { TaskValidator} from "../validators/TaskValidator";
import { TeamValidator } from "../validators/TeamValidator";
import { WorkValidator } from "../validators/WorkValidator";

class DiscussionRouter {
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
        "/getdiscussion",
        GlobalMiddleWare.authenticate,
        GlobalMiddleWare.checkError,
        DiscussionController.getDiscussion
      );

    //   this.router.get(
    //     "/getTaskDetail/:TeamId/:projectId/:taskId",
    //     GlobalMiddleWare.authenticate,
    //     TeamValidator.getTeamById(),
    //     WorkValidator.getProjectById(),
    //     TaskValidator.getTaskById(),
    //     GlobalMiddleWare.checkError,
    //     TaskController.getTaskDetail
    //   );

    //   this.router.get(
    //     "/getFiles/:TeamId/:projectId",
    //     GlobalMiddleWare.authenticate,
    //     TeamValidator.getTeamById(),
    //     WorkValidator.getProjectById(),
    //     GlobalMiddleWare.checkError,
    //     TaskController.getFiles
    //   );
     

  }

  postRoutes() {
      this.router.post("/createDiscussion/:TeamId/:projectId",
      GlobalMiddleWare.authenticate,
      TeamValidator.getTeamById(),
      WorkValidator.getProjectById(),
      DiscussionValidator.createDiscussion(),
      GlobalMiddleWare.checkError,
      DiscussionController.createDiscussion
      );
   
  }
  patchRoutes() {
    // this.router.post("/editTask/:TeamId/:projectId/:taskId",
    // GlobalMiddleWare.authenticate,
    // TeamValidator.getTeamById(),
    // WorkValidator.getProjectById(),
    // TaskValidator.getTaskById(),
    // GlobalMiddleWare.checkError,
    // TaskController.editTask
    // );

    this.router.patch("/addDiscussion/:TeamId/:projectId/:discussionId",
    GlobalMiddleWare.authenticate,
    new Utils().multer.single('image'),
    TeamValidator.getTeamById(),
    WorkValidator.getProjectById(),
    DiscussionValidator.getDiscussionById,
    GlobalMiddleWare.checkError,
    DiscussionController.addDiscussion
    );
   
  }
  deleteRoutes() {}
}

export default new DiscussionRouter().router;
