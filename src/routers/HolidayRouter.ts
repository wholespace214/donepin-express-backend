import { Router } from "express";
import { HolidayController } from "../controllers/HolidayController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWares";
import { HolidayValidator } from "../validators/HolidayValidator";

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
      "/getAllHoliday",
      GlobalMiddleWare.authenticate,
      GlobalMiddleWare.checkError,
      HolidayController.getAllHoliday
    );
  }

  postRoutes() {
    this.router.post(
      "/createHoliday/:teamId",
      GlobalMiddleWare.authenticate,
      HolidayValidator.createHoliday(),
      GlobalMiddleWare.checkError,
      HolidayController.createHoliday
    );
  }
  patchRoutes() {}
  deleteRoutes() {}
}

export default new HolidayRouter().router;
