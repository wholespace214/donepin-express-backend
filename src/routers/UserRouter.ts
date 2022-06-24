import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidator } from "../validators/UserValidator";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWares";

class UserRouter {
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
      "/reset/password",
      UserValidator.sendResetPasswordEmail(),
      GlobalMiddleWare.checkError,
      UserController.sendResetPasswordEmail
    );

    this.router.get(
      "/verify/resetPasswordToken",
      UserValidator.verifyResetPasswordToken(),
      GlobalMiddleWare.checkError,
      UserController.verifyResetPasswordToken
    );

    //users 

    this.router.get(
      "/getUsers",
      GlobalMiddleWare.authenticate,
      GlobalMiddleWare.checkError,
      UserController.getUsers
    );


    // group routes Api
    this.router.get(
      "/getGroupMembers",
      GlobalMiddleWare.authenticate,
      UserValidator.getMember(),
      GlobalMiddleWare.checkError,
      UserController.getMember
    );

    this.router.get(
      "/getGroups",
       GlobalMiddleWare.authenticate,
      // UserValidator.getGroups(),
      GlobalMiddleWare.checkError,
      UserController.getGroups
    );

    // team routes Api

    this.router.get("/getTeamMembers",
     GlobalMiddleWare.authenticate,
    GlobalMiddleWare.checkError,
    UserController.getTeamMembers);
  }

  postRoutes() {
    this.router.post(
      "/register",
      UserValidator.register(),
      GlobalMiddleWare.checkError,
      UserController.register
    );
    this.router.post(
      "/login",
      UserValidator.login(),
      GlobalMiddleWare.checkError,
      UserController.login
    );
    this.router.post(
      "/resend/verification/email",
      UserValidator.resendVerificationEmail(),
      GlobalMiddleWare.checkError,
      UserController.resendVerificationEmail
    );

    // Team routes Api

    this.router.post(
      "/addTeamMember/:memberId",
      GlobalMiddleWare.authenticate,
      UserValidator.addTeamMember(),
      GlobalMiddleWare.checkError,
      UserController.addTeamMember
    );
    this.router.post(
      "/resend/teamVerificationToken",
      GlobalMiddleWare.authenticate,
      UserController.resendTeamVerification
    );

    // Group routes Api

    this.router.post(
      "/createGroup/:teamId",
      GlobalMiddleWare.authenticate,
      UserValidator.createGroup(),
      GlobalMiddleWare.checkError,
      UserController.createGroup
    );

  }
  patchRoutes() {
    this.router.patch(
      "/verify",
      UserValidator.verify(),
      GlobalMiddleWare.checkError,
      UserController.verify
    );

    this.router.patch(
      "/resetPassword",
      UserValidator.resetPassword(),
      GlobalMiddleWare.checkError,
      UserController.resetPassword
    );

    this.router.patch(
      "/update/password",
      GlobalMiddleWare.authenticate,
      UserValidator.updatePassword(),
      GlobalMiddleWare.checkError,
      UserController.updatePassword
    );

    // Team routes Api

    this.router.patch(
      "/verify/teamMemberToken",
      UserValidator.verifyTeamMemberToken(),
      GlobalMiddleWare.checkError,
      UserController.verifyTeamMemberToken
    );

    this.router.patch(
      "/editMember/:_id/:memberId",
      GlobalMiddleWare.authenticate,
      UserValidator.editMember(),
      GlobalMiddleWare.checkError,
      UserController.editMember
    );
    this.router.patch(
      "/addTeamRole/:_id/:memberId",
      GlobalMiddleWare.authenticate,
      UserValidator.addRole(),
      GlobalMiddleWare.checkError,
      UserController.addRole
    );

    this.router.patch(
      "/editTeamRole/:_id/:memberId",
      GlobalMiddleWare.authenticate,
      UserValidator.editRole(),
      GlobalMiddleWare.checkError,
      UserController.editRole
    );


    //group routes Api
    this.router.patch(
      "/addGroupMember/:_id/:memberId",
      GlobalMiddleWare.authenticate,
      UserValidator.addGroupMember(),
      GlobalMiddleWare.checkError,
      UserController.addGroupMember
    );


      //Attendance team member routes Api

    this.router.patch("/startClock", 
    GlobalMiddleWare.authenticate,
    GlobalMiddleWare.checkError,
    UserController.startClock);

    this.router.patch("/pauseClock", 
    GlobalMiddleWare.authenticate,
    GlobalMiddleWare.checkError,
    UserController.pauseClock);

    this.router.patch("/resumeClock", 
    GlobalMiddleWare.authenticate,
    GlobalMiddleWare.checkError,
    UserController.resumeClock);

    this.router.patch("/stopClock/:_id", 
    GlobalMiddleWare.authenticate,
    UserValidator.stopClock(),
    GlobalMiddleWare.checkError,
    UserController.stopClock);


  }
  deleteRoutes() {}
}

export default new UserRouter().router;
