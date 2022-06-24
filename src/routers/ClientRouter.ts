import { Router } from "express";
import { ClientController } from "../controllers/ClientController";
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
        "/getClientDetail/:ClientId",
        GlobalMiddleWare.authenticate,
       TeamValidator.getTeamById(),
        GlobalMiddleWare.checkError,
        ClientController.getClientDetail
      );
      this.router.get(
        "/getClient/:TeamId",
        GlobalMiddleWare.authenticate,
       TeamValidator.getTeamById(),
        GlobalMiddleWare.checkError,
        ClientController.getClient
      );
  }

  postRoutes() {
    this.router.post(
        "/createClient/:TeamId",
        GlobalMiddleWare.authenticate,
       TeamValidator.getTeamById(),
        GlobalMiddleWare.checkError,
        ClientController.createClient
      );
  }
  patchRoutes() {
    this.router.patch(
        "/updateClient/:TeamId/:ClientId",
        GlobalMiddleWare.authenticate,
       TeamValidator.getTeamById(),
        GlobalMiddleWare.checkError,
        ClientController.updateClientById
      );
  }
  deleteRoutes() {}
}

export default new InvoiceRouter().router;
