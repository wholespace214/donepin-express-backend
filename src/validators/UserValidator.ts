import { body, query, param } from "express-validator";
import Team from "../models/Team";
import User from "../models/User";
import Group from "../models/Group";
import Attendance from "../models/Attendance";

export class UserValidator {
  static register() {
    return [
      body("email", "email is required")
        .isEmail()
        .custom((email) => {
          return User.findOne({ email: email }).then((user) => {
            if (user) {
              throw new Error("User already exists");
            } else {
              return true;
            }
          });
        }),
      body("password", "password is required")
        .isAlphanumeric()
        .isLength({ min: 8, max: 20 })
        .withMessage("password can be between 8 to 20 charaters only")
        .custom((password, { req }) => {
          if (password === req.body.confirmPassword) {
            return true;
          } else {
            throw new Error("Confirm Password and password Should be Matched");
          }
        }),
      body("confirmPassword", "confirm Password is required")
        .isAlphanumeric()
        .isLength({ min: 8, max: 20 }),
      body("firstName", "first name is required").isString(),
      body("lastName", "last name is required").isString(),
    ];
  }

  static login() {
    return [
      body("email", "Email is Required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email: email, isverified: true }).then(
            (user) => {
              if (user) {
                req.user = user;
                return true;
              } else {
                throw new Error("USER DOES NOT EXIST OR NOT VERIFIED");
              }
            }
          );
        }),
      body("password", "password is Required").isAlphanumeric(),
    ];
  }

  static resendVerificationEmail() {
    return [body("email", "email is Required").isEmail()];
  }

  static verify() {
    return [
      body("email", "email is Required").isEmail(),
      body("verificationToken", "token is required").isNumeric(),
    ];
  }

  static sendResetPasswordEmail() {
    return [
      query("email", "Email is Required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email: email }).then((user) => {
            if (user) {
              return true;
            } else {
              throw new Error("Email does not exist");
            }
          });
        }),
    ];
  }

  static verifyResetPasswordToken() {
    return [
      query("resetPasswordToken", "Reset Password Token Is Required")
        .isNumeric()
        .custom((token, { req }) => {
          return User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenTime: { $gt: Date.now() },
          }).then((user) => {
            if (user) {
              return true;
            } else {
              throw new Error("Token Does not Exist! Please request Again");
            }
          });
        }),
    ];
  }

  static resetPassword() {
    return [
      body("newPassword", "New Password is required")
        .isAlphanumeric()
        .custom((newPassword, { req }) => {
          if (newPassword === req.body.confirmPassword) {
            return true;
          } else {
            throw new Error(
              "Confirm Password and New Password Should be Matched"
            );
          }
        }),
      body("confirmPassword", "Confirm Password is required").isAlphanumeric(),
      body("resetPasswordToken", "Reset Password Token is Required")
        .isNumeric()
        .custom((token, { req }) => {
          return User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenTime: { $gt: Date.now() },
          }).then((user) => {
            if (user) {
              req.user = user;
              if (Number(req.user.resetPasswordToken) === Number(token)) {
                return true;
              } else {
                req.errorStatus = 422;
                throw new Error("Reset Password Token is Invalid , Try again");
              }
            }
          });
        }),
    ];
  }

  static updatePassword() {
    return [
      body("password", "password is required").isAlphanumeric(),
      body("confirmPassword", "Confirm password is required").isAlphanumeric(),
      body("newPassword", "New password is required")
        .isAlphanumeric()
        .custom((newPassword, { req }) => {
          if (newPassword === req.body.confirmPassword) {
            return true;
          } else {
            req.errorStatus = 422;
            throw new Error("Password and Confirm Password does not Matched");
          }
        }),
    ];
  }

  //Team Operations Api Methods

  static addTeamMember() {
    return [
      param("memberId", "member Id is required").isAlphanumeric(),
      body("memberEmail", "memberEmail is required").isEmail(),
    ];
  }

  static verifyTeamMemberToken() {
    return [
      body("memberEmail", "email is Required")
        .isEmail()
        .custom((memberEmail, { req }) => {
          return Team.findOne({ memberEmail: memberEmail }).then((team) => {
            if (team) {
              req.team = team;
            } else {
              throw new Error("Team not found");
            }
          });
        }),
      body("teamVerificationToken", "token is required").isNumeric(),
    ];
  }

  static editMember() {
    return [
      param("_id").custom((_id, { req }) => {
        return Team.findOne({ _id: _id }).then((team) => {
          if (team) {
            req.team = team;
            return true;
          } else {
            throw new Error("Invalid Team");
          }
        });
      }),
      param("memberId", "member Id is required").isAlphanumeric(),
    ];
  }

  static addRole() {
    return [
      param("_id").custom((_id, { req }) => {
        return Team.findOne({ _id: _id }).then((team) => {
          if (team) {
            req.team = team;
            return true;
          } else {
            throw new Error("Invalid Team");
          }
        });
      }),
      param("memberId", "member Id is required").isAlphanumeric(),
    ];
  }

  static editRole() {
    return [
      param("_id").custom((_id, { req }) => {
        return Team.findOne({ _id: _id }).then((team) => {
          if (team) {
            req.team = team;
            return true;
          } else {
            throw new Error("Invalid Team");
          }
        });
      }),
      param("memberId", "member Id is required").isAlphanumeric(),
    ];
  }

  // Group Operations Api

  static createGroup() {
    return [
      body("groupName", "group Name is required").isString(),
      param("teamId", "team Id is required").custom((teamId, { req }) => {
        return Team.findOne({ _id: teamId }).then((team) => {
          if (team) {
            req.team = team;
            return true;
          } else {
            throw new Error("Invalid Team Id");
          }
        });
      }),
    ];
  }

  static addGroupMember() {
    return [
      param("_id", "group Id is required").custom((_id, { req }) => {
        return Group.findOne({ _id: _id }).then((group) => {
          if (group) {
            req.group = group;
            return true;
          } else {
            throw new Error("Invalid Group Id");
          }
        });
      }),
      param("memberId", "member Id is required").custom((memberId, { req }) => {
        return User.findOne({ _id: memberId }).then((member) => {
          if (member) {
            req.member = member;
            return true;
          } else {
            throw new Error("Invalid Member Id");
          }
        });
      }),
    ];
  }

  static getMember() {
    return [
      query("groupName", "groupName is required").custom(
        (groupName, { req }) => {
          return Group.findOne({ groupName: groupName }).then((group) => {
            if (group) {
              req.group = group;
              return true;
            } else {
              throw new Error("Group does not exist");
            }
          });
        }
      ),
    ];
  }

  // static getGroups() {
  //   return [
  //     query("groupName","groupName is required").custom((groupName,{ req})=>{
  //       return Group.findOne({groupName:groupName}).then((member)=>{
  //         if(member){
  //           req.member = member;
  //           return true;
  //         }else{
  //           throw new Error("Group does not exist");
  //         }
  //       })
  //     })
  //   ]
  // }

  // Attendance routes Api

  static stopClock() {
    return [
      param("_id", "_id is required").custom((_id, { req }) => {
        return Attendance.findOne({ _id: _id }).then((attendance) => {
          if (attendance) {
            req.attendance = attendance;
          } else {
            throw new Error("Invalid Attendance Id");
          }
        });
      }),
    ];
  }
}
