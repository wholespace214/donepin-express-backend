import { Router } from "express";
import { InvoiceController } from "../controllers/InvoiceController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWares";
import { TaskValidator } from "../validators/TaskValidator";
import { TeamValidator } from "../validators/TeamValidator";
import { WorkValidator } from "../validators/WorkValidator";

class InvoiceRouter {
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
        "/getInvoice/:TeamId",
        GlobalMiddleWare.authenticate,
       TeamValidator.getTeamById(),
        GlobalMiddleWare.checkError,
        InvoiceController.getInvoice
      );
  }

  postRoutes() {
    this.router.post(
        "/createInvoice/:TeamId",
        GlobalMiddleWare.authenticate,
       TeamValidator.getTeamById(),
        GlobalMiddleWare.checkError,
        InvoiceController.createInvoice
      );
  }
  patchRoutes() {
    this.router.patch(
        "/updateInvoice/:TeamId/:InvoiceId",
        GlobalMiddleWare.authenticate,
       TeamValidator.getTeamById(),
        GlobalMiddleWare.checkError,
        InvoiceController.updateInvoiceById
      );

      this.router.patch(
        "/updateSetting/:TeamId",
        GlobalMiddleWare.authenticate,
       TeamValidator.getTeamById(),
        GlobalMiddleWare.checkError,
        InvoiceController.updateSettingById
      );
  }
  deleteRoutes() {}
}

export default new InvoiceRouter().router;
