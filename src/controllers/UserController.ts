import User from "../models/User";
import { Utils } from "../utils/Utils";
import * as jwt from "jsonwebtoken";
import {
  differenceInMilliseconds,
  millisecondsToHours,
  millisecondsToMinutes,
  millisecondsToSeconds,
} from "date-fns";
// import { getEnvironment } from "../environments/env";
import { NodeMailer } from "../utils/NodeMailer";
import Team from "../models/Team";
import Group from "../models/Group";
import Attendance from "../models/Attendance";
import * as moment from "moment";

export class UserController {
  static async register(req, res, next) {
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const verificationToken = new Utils().genreateVerificationToken(6);
    try {
      const hash = await Utils.encryptPassword(password);
      const data = {
        email: email,
        password: hash,
        firstName: firstName,
        lastName: lastName,
        emailVerificationToken: verificationToken,
        emailVerificationTokenTime: Date.now() + new Utils().MAX_TOKEN_TIME,
      };

      console.log(data);
      let user = await new User(data).save();
      res.status(200).json({
        message: "REGISTRATION SUCCESSFULL",
        Status_code: 200,
        data: user,
      });
      await NodeMailer.sendEmail({
        to: email,
        subject: "Email Verification",
        html: `Hello ,Please use this OTP to verify your account - <b>${verificationToken}</b>`,
      });
    } catch (e) {
      next(e);
    }
  }

  static async login(req, res, next) {
    const password = req.body.password;
    const user = req.user;
    try {
      await Utils.comparePassword({
        plainPassword: password,
        encryptedPassword: user.password,
      });
      const token = jwt.sign(
        {
          email: user.email,
          _id: user._id,
          role: user.role,
        },
        process.env.SECRET_KEY,
        { expiresIn: "365d" }
      );
      const data = { user: user, token: token };
      res
        .status(200)
        .json({ message: "LOGIN SUCCESSFULL", Status_code: 200, data: data });
    } catch (e) {
      next(e);
    }
  }

  static async resendVerificationEmail(req, res, next) {
    const email = req.body.email;
    const verificationToken = new Utils().genreateVerificationToken(6);
    try {
      const user: any = await User.findOneAndUpdate(
        { email: email },
        {
          emailVerificationToken: verificationToken,
          emailVerificationTokenTime: Date.now() + new Utils().MAX_TOKEN_TIME,
        },
        { new: true }
      );

      if (user) {
        await NodeMailer.sendEmail({
          to: [user.email],
          subject: "Email Verification",
          html: `Hello ,Please use this OTP to verify your account - <b>${verificationToken}</b>`,
        });
        res.status(200).json({
          Status_code: 200,
          success: true,
          message: "Verification token Send",
          data: email,
        });
      } else {
        throw Error("User Does Not Exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async verify(req, res, next) {
    const verificationToken = req.body.verificationToken;
    const email = req.body.email;

    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
          emailVerificationToken: verificationToken,
          emailVerificationTokenTime: { $gt: Date.now() },
        },
        { isEmailVerified: true, updatedAt: Date.now(), status: "ACTIVE" },
        { new: true }
      );
      if (user) {
        res.status(200).json({
          Status_code: 200,
          message: "Account Verification",
          data: user,
        });
      } else {
        throw new Error("User Does Not Exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async sendResetPasswordEmail(req, res, next) {
    const email = req.query.email;
    const resetPasswordToken = new Utils().genreateVerificationToken(6);

    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          updatedAt: new Date(),
          resetPasswordToken: resetPasswordToken,
          resetPasswordTokenTime: Date.now() + new Utils().MAX_TOKEN_TIME,
        },
        { new: true }
      );

      if (user) {
        res.status(200).send({
          Status_code: 200,
          message: "token has been sent successfully",
        });

        await NodeMailer.sendEmail({
          to: [email],
          subject: "Reset Password email",
          html: `<h1>${resetPasswordToken}</h1>`,
        });
      }

      throw new Error("User Does Not Exist");
    } catch (e) {
      next(e);
    }
  }

  static verifyResetPasswordToken(req, res, next) {
    res.status(200).json({
      Status_code: 200,
      success: true,
      message: "Reset Password token has been Verified",
    });
  }

  static async resetPassword(req, res, next) {
    const user = req.user;
    const newPassword = req.body.newPassword;
    try {
      const encryptedPassword = await Utils.encryptPassword(newPassword);
      const updateUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          updated_at: new Date(),
          password: encryptedPassword,
        },
        { new: true }
      );
      res.status(200).json({
        Status_code: 200,
        message: "Password RESET SUCCESSFULLY",
        data: updateUser,
      });
    } catch (e) {
      next(e);
    }
  }

  static async updatePassword(req, res, next) {
    const user_id = req.user._id;
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    try {
      const user: any = await User.findOne({ _id: user_id });
      await Utils.comparePassword({
        plainPassword: password,
        encryptedPassword: user.password,
      });
      const encryptedPassword = await Utils.encryptPassword(newPassword);

      const doc = await User.findOneAndUpdate(
        { _id: user_id },
        { password: encryptedPassword },
        { new: true }
      );
      if (doc) {
        res.status(200).json({
          Status_code: 200,
          message: "Password updated successfully",
          data: doc,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  static async getUsers(req, res, next) {
   
    try {
      const users: any = await User.find();
      if (users) {
        res.status(200).json({
          Status_code: 200,
          message: "User Fetched successfully",
          data: users,
        });
      }else{
        res.status(400).json({message:"No users found"});
      }
    } catch (e) {
      next(e);
    }
  }

  //Team Operations Api Methods

  static async addTeamMember(req, res, next) {
    try {
      const userId = req.user._id;
      const groupId = req.body.groupId;
      const memberEmail = req.body.memberEmail;
      const memberId = req.params.memberId;
      const verificationToken = new Utils().genreateVerificationToken(6);
      const {
        workingTime,
        hoursPerWeek,
        yearlyVacation,
        isVacationReset,
        vacationResetMonth,
        workingDays,
      } = req.body;

      const attendance = {
        memberId,
        adminId: userId,
        workingTime,
        hoursPerWeek,
        yearlyVacation,
        isVacationReset,
        vacationResetMonth,
        workingDays,
      };

      const valid = await User.findOne({
        email: memberEmail,
        _id: memberId,
        isDeleted: false,
      });

      if (valid) {
        const check = await Team.findOne({
          memberEmail: memberEmail,
          memberId: memberId,
          isDeleted: false,
          isMember: false,
        });
        if (check) {
          throw new Error("This Member is already exists");
        } else {
          const attendanceCheck = await Attendance.findOne({
            memberId: memberId,
            adminId: userId,
          });

          if (!attendanceCheck) {
            const newAttendance = await new Attendance(attendance).save();
            const data = {
              adminId: userId,
              groupId: groupId,
              memberEmail: memberEmail,
              memberId: memberId,
              attendanceId: newAttendance,
              teamMemberStatus: req.body.teamMemberStatus,
              memberJobRole: req.body.memberJobRole,
              teamVerificationToken: verificationToken,
              teamVerificationTokenTime:
                Date.now() + new Utils().MAX_TOKEN_TIME,
            };

            const doc = await new Team(data).save();
            const updateDoc = await User.findOneAndUpdate(
              { _id: userId },
              {
                roleAccess: { isManage: true, isAdmin: true, isTeam: true },
                isAdminAccess: true,
              },
              { new: true }
            );
            res.status(200).json({
              Status_code: 200,
              message:
                "Team Member is successfully created, Please verify TeamMember with verification Token genrated on Email",
              data: doc,
              updatedDoc: updateDoc,
            });

            await NodeMailer.sendEmail({
              to: memberEmail,
              subject: "Team Member Email Verification",
              html: `Hello ,Please use this OTP to verify your account - <b>${verificationToken}</b>`,
            });
          } else {
            throw new Error(
              "member already exists, can't set attendance details"
            );
          }
        }
      } else {
        res.json({
          message: "Email does not exist, Please register !",
        });
        await NodeMailer.sendEmail({
          to: memberEmail,
          subject: "Team Member Invitation",
          html: `Hello ,Please register youself to become a member of this team`,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  static async resendTeamVerification(req, res, next) {
    const memberEmail = req.body.memberEmail;
    const userId = req.user._id;
    const verificationToken = new Utils().genreateVerificationToken(6);
    try {
      const team: any = await Team.findOneAndUpdate(
        { userId: userId, memberEmail: memberEmail, _id: req.body._id },
        {
          teamVerificationToken: verificationToken,
          teamVerificationTokenTime: Date.now() + new Utils().MAX_TOKEN_TIME,
        }
      );

      if (team) {
        await NodeMailer.sendEmail({
          to: [memberEmail],
          subject: "Email Verification",
          html: `<h1> ${verificationToken}</h1>`,
        });
        res.json({
          Status_code: 200,
          success: true,
          message: "Verification token resend successfully on your email",
        });
      } else {
        throw Error("User Does Not Exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async verifyTeamMemberToken(req, res, next) {
    const teamVerificationToken = req.body.teamVerificationToken;
    const memberEmail = req.body.memberEmail;
    const team = req.team;

    try {
      const team = await Team.findOneAndUpdate(
        {
          memberEmail: memberEmail,
          emailVerificationToken: teamVerificationToken,
          emailVerificationTokenTime: { $gt: Date.now() },
        },
        { isMember: true, updatedAt: Date.now(), teamMemberStatus: "ACTIVE" },
        { new: true }
      );
      if (team) {
        const updateAttendace = await Attendance.findOneAndUpdate(
          { memberId: team.memberId },
          { teamId: team._id },
          { new: true }
        );
        res.status(200).json({
          Status_code: 200,
          message: "Team Member Verification Successfully Completed",
          data: team,
          updatedData: updateAttendace,
        });
      } else {
        throw new Error("User Does Not Exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async editMember(req, res, next) {
    const userId = req.user._id;
    const memberId = req.params.memberId;
    const _id = req.params._id;

    console.log(_id);
    console.log(memberId);
    console.log(userId);
    try {
      const doc = await Team.findOneAndUpdate(
        {
          adminId: userId,
          _id: _id,
          memberId: memberId,
          isDeleted: false,
          isMember: true,
        },
        { ...req.body, updatedAt: Date.now() },
        { new: true }
      );
      if (doc) {
        res.status(200).json({
          Status_code: 200,
          message: "Member Edit Successfully Completed",
          data: doc,
        });
      }
      throw new Error("Member Does Not Exist");
    } catch (e) {
      next(e);
    }
  }

  static async getTeamMembers(req, res, next) {
    const adminId = req.user._id;
    const page = parseInt(req.query.page);
    const sort = req.query.sort;
    const limit = parseInt(req.query.limit);

    const perPage = 5;
    let currentPageToken = page;
    let previousPageToken = page === 1 ? null : page - 1;
    let nextPageToken = page + 1;
    let totalPages;
    try {
      const postCount = await Team.estimatedDocumentCount();
      totalPages = Math.ceil(postCount / perPage);
      if (totalPages === currentPageToken || totalPages === 0) {
        nextPageToken = null;
      }
      if (page > totalPages) {
        throw new Error("No More Team Member To show");
      }

      const data = await Team.find({ adminId: adminId })
        .sort({ createdAt: sort || -1 })
        .limit(perPage || limit)
        .skip(perPage * page - perPage);
      res.status(200).json({
        Status_code: 200,
        message: "Team Members",
        nextPageToken: nextPageToken,
        totalPage: totalPages,
        currentPageToken: currentPageToken,
        previousPageToken: previousPageToken,
        data: data,
      });
    } catch (e) {
      next(e);
    }
  }

  static async addRole(req, res, next) {
    const userId = req.user._id;
    const memberId = req.params.memberId;
    const _id = req.team._id;
    const memberJobRole = req.body.memberJobRole;
    console.log(_id);
    console.log(memberId);
    console.log(userId);
    try {
      let role;
      if (role) {
      }
      const doc = await Team.findOneAndUpdate(
        {
          adminId: userId,
          _id: _id,
          memberId: memberId,
          isDeleted: false,
          isMember: true,
        },
        { ...memberJobRole, updatedAt: Date.now() },
        { new: true }
      );
      if (doc) {
        res.status(200).json({
          Status_code: 200,
          message: "Role Add Successfully Completed",
          data: doc,
        });
      } else {
        throw new Error("Member Does Not Exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async editRole(req, res, next) {
    const userId = req.user._id;
    const memberId = req.params.memberId;
    const _id = req.team._id;
    const { isView, isManage, isAdmin, isTeam } = req.body;

    console.log(_id);
    console.log(memberId);
    console.log(userId);
    try {
      const doc = await Team.findOneAndUpdate(
        {
          adminId: userId,
          _id: _id,
          memberId: memberId,
          isDeleted: false,
          isMember: true,
        },
        {
          memberJobRole: req.body.memberJobRole,
          roleAccess: {
            isView: isView || true,
            isManage: isManage || false,
            isAdmin: isAdmin || false,
            isTeam: isTeam || false,
          },

          updatedAt: Date.now(),
        },
        { new: true }
      );
      if (doc) {
        res.status(200).json({
          Status_code: 200,
          message: "Role Edit Successfully Completed",
          data: doc,
        });
      } else {
        throw new Error("Member Does Not Exist");
      }
    } catch (e) {
      next(e);
    }
  }

  // Group Operations Api

  static async createGroup(req, res, next) {
    const groupName = req.body.groupName;
    const userId = req.user._id;
    const teamId = req.team._id;
    try {
      const check = await Group.findOne({
        adminId: userId,
        groupName: groupName,
      });
      if (check) {
        throw new Error("Group already exists");
      } else {
        const doc = {
          groupName,
          adminId: userId,
          status: "ACTIVE",
          teamId: teamId,
        };

        const group = await new Group(doc).save();
        res.status(200).json({
          Status_code: 200,
          message: "Group created successfully",
          data: group,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  static async addGroupMember(req, res, next) {
    const memberId = req.member._id;
    const userId = req.user._id;
    const groupId = req.group._id;

    try {
      const member = await Group.findOneAndUpdate(
        { adminId: userId, _id: groupId },
        {
          groupMemberId: memberId,
          groupMemberStatus: "ACTIVE",
          updatedAt: Date.now(),
        },
        { new: true }
      );
      if (member) {
        console.log(member);
        res.status(200).json({
          Status_code: 200,
          message: "Member added",
          data: member,
        });
      } else {
        throw new Error("Group does not exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async getMember(req, res, next) {
    const adminId = req.user._id;
    const page = parseInt(req.query.page);
    const sort = req.query.sort;
    const limit = parseInt(req.query.limit);

    const perPage = 5;
    let currentPageToken = page;
    let previousPageToken = page === 1 ? null : page - 1;
    let nextPageToken = page + 1;
    let totalPages;
    try {
      const postCount = await Group.estimatedDocumentCount();
      totalPages = Math.ceil(postCount / perPage);
      if (totalPages === currentPageToken || totalPages === 0) {
        nextPageToken = null;
      }
      if (page > totalPages) {
        throw new Error("No More Group To show");
      }

      const data = await Group.find(
        {
          adminId: adminId,
          groupName: req.group.groupName,
        },
        { groupMemberId: 1 }
      )
        .sort({ createdAt: sort || -1 })
        .limit(perPage || limit)
        .skip(perPage * page - perPage);
      res.status(200).json({
        Status_code: 200,
        message: "Members",
        nextPageToken: nextPageToken,
        totalPage: totalPages,
        currentPageToken: currentPageToken,
        previousPageToken: previousPageToken,
        data: data,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getGroups(req, res, next) {
    const adminId = req.user._id;
    const page = parseInt(req.query.page);
    const sort = req.query.sort;
    const limit = parseInt(req.query.limit);

    const perPage = 5;
    let currentPageToken = page;
    let previousPageToken = page === 1 ? null : page - 1;
    let nextPageToken = page + 1;
    let totalPages;
    try {
      const postCount = await Group.estimatedDocumentCount();
      totalPages = Math.ceil(postCount / perPage);
      if (totalPages === currentPageToken || totalPages === 0) {
        nextPageToken = null;
      }
      if (page > totalPages) {
        throw new Error("No More Group To show");
      }

      const data = await Group.find({ adminId: adminId })
        .sort({ createdAt: sort || -1 })
        .limit(perPage || limit)
        .skip(perPage * page - perPage);
      res.status(200).json({
        Status_code: 200,
        message: "Groups",
        nextPageToken: nextPageToken,
        totalPage: totalPages,
        currentPageToken: currentPageToken,
        previousPageToken: previousPageToken,
        data: data,
      });
    } catch (e) {
      next(e);
    }
  }

  // Attendance Operations Api

  static async startClock(req, res, next) {
    const userId = req.user._id;
    try {
      const doc = await Attendance.findOneAndUpdate(
        { memberId: userId },
        {
          checkIn: Date.now(),
          updatedAt: Date.now(),
        },
        { new: true }
      );

      res.send(doc);
    } catch (e) {
      next(e);
    }
  }

  /// need to check here -> break (check time difference) and  total workingTime (check time difference)

  static async stopClock(req, res, next) {
    const userId = req.user._id;
    let dateData = moment();
    const attendance = req.attendance;
    let pauseTime = moment(attendance.pause);
    let resumeTime = moment(attendance.resume);
    let checkIn = moment(attendance.checkIn);
    let breakDuration = moment.duration(resumeTime.diff(pauseTime));
    let totalTimeDuration = moment.duration(dateData.diff(checkIn));
    try {
      const doc = await Attendance.findOneAndUpdate(
        { memberId: userId, _id: attendance._id },
        {
          checkOut: Date.now(),
          break: `${breakDuration.get("hours")}:${breakDuration.get(
            "minutes"
          )}:${breakDuration.get("seconds")}`,
          totalTimeDuration: `${totalTimeDuration.get(
            "hours"
          )}:${totalTimeDuration.get("minutes")}:${totalTimeDuration.get(
            "seconds"
          )}`,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.send(doc);
    } catch (e) {
      next(e);
    }
  }

  static async pauseClock(req, res, next) {
    const userId = req.user._id;
    try {
      const doc = await Attendance.findOneAndUpdate(
        { memberId: userId },
        {
          pause: Date.now(),
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.send(doc);
    } catch (e) {
      next(e);
    }
  }

  static async resumeClock(req, res, next) {
    const userId = req.user._id;
    try {
      const doc = await Attendance.findOneAndUpdate(
        { memberId: userId },
        {
          resume: Date.now(),
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.send(doc);
    } catch (e) {
      next(e);
    }
  }
}
