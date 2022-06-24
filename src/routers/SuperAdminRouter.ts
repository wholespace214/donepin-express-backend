import { Router } from "express";
import { SuperAdminController } from "../controllers/SuperAdminController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWares";
import { SuperAdminValidator } from "../validators/SuperAdminValidator";

class SuperAdminRouter {
  public router: Router;
  constructor() {
    this.router = Router();
    this.getRoutes();
     this.postRoutes();
    this.patchRoutes();
  }

  getRoutes() {
    this.router.get(
      "/get/Users",
      SuperAdminController.getUsers,
      SuperAdminValidator.getUsers(),
      GlobalMiddleWare.checkError
    ),
      this.router.get("/get/WorkSpace", SuperAdminController.workSpace),
      this.router.get("/get/Payments", SuperAdminController.getPayments),
      this.router.get("/GeneratePDF/:id", SuperAdminController.GeneratePDF);
      this.router.get("/get/Plans", SuperAdminController.getPlans);
  }
  patchRoutes() {
    this.router.patch(
      "/update/Users/:id",
      SuperAdminController.updateUser,
      SuperAdminValidator.updateUser(),
      GlobalMiddleWare.checkError
    ),
      this.router.patch("/update/Work/:id", SuperAdminController.updateWork),

    this.router.patch("/update/Payments/:id", SuperAdminController.updatePayments);
    this.router.patch("/update/Plans/:id", SuperAdminController.updatePlan);
  }
  postRoutes(){
  this.router.post("/create/Plan",SuperAdminController.CreatePlans)
}
}
export default new SuperAdminRouter().router;
