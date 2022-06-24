import { Router } from "express";
import { CompanyController } from "../controllers/CompanyController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWares";
import { Utils } from "../utils/Utils";
import { TaskValidator } from "../validators/TaskValidator";
import { TeamValidator } from "../validators/TeamValidator";
import { WorkValidator } from "../validators/WorkValidator";

class CompanyRouter {
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
        "/getCompanyById/:TeamId/:CompanyId",
        GlobalMiddleWare.authenticate,
       TeamValidator.getTeamById(),
        GlobalMiddleWare.checkError,
        CompanyController.getCompanyById
      );
  }

  postRoutes() {
    this.router.post(
        "/createCompany/:TeamId",
        GlobalMiddleWare.authenticate,
        new Utils().multer.single('logo'),
       TeamValidator.getTeamById(),
        GlobalMiddleWare.checkError,
        CompanyController.createCompany
      );
  }
  patchRoutes() {
    this.router.patch(
        "/updateCompany/:TeamId/:CompanyId",
        GlobalMiddleWare.authenticate,
       TeamValidator.getTeamById(),
        GlobalMiddleWare.checkError,
        CompanyController.updateCompanyById
      );
  }
  deleteRoutes() {}
}

export default new CompanyRouter().router;
