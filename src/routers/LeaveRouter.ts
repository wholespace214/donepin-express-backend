import { Router } from "express";
import { LeaveController } from "../controllers/LeaveController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWares";
import { LeaveValidator } from "../validators/LeaveValidator";

class LeaveRouter {
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
      "/getAllMemberLeaves",
      GlobalMiddleWare.authenticate,
      GlobalMiddleWare.checkError,
      LeaveController.getAllMemberLeaves
    );
  }

  postRoutes() {
    this.router.post(
      "/createLeave/:teamId/:memberId",
      GlobalMiddleWare.authenticate,
      LeaveValidator.createLeave(),
      GlobalMiddleWare.checkError,
      LeaveController.createLeave
    );
  }
  patchRoutes() {}
  deleteRoutes() {}
}

export default new LeaveRouter().router;
