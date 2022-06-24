import { Router } from "express";
import { AttendanceController } from "../controllers/AttendanceController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWares";

class HolidayRouter {
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
      "/getAllMemberAttendance",
      GlobalMiddleWare.authenticate,
      GlobalMiddleWare.checkError,
      AttendanceController.getAllMemberAttendance
    );
  }

  postRoutes() { }
  patchRoutes() {
    this.router.patch(
        "/editAttendance/:_id/:memberId",
        GlobalMiddleWare.authenticate,
        GlobalMiddleWare.checkError,
        AttendanceController.editMemberAttendance
      );

      this.router.patch(
        "/approvalStatus/:_id/:memberId",
        GlobalMiddleWare.authenticate,
        GlobalMiddleWare.checkError,
        AttendanceController.statusUpdateAttendance
      );
  }
  deleteRoutes() {}
}

export default new HolidayRouter().router;
