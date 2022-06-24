import { validationResult } from "express-validator";
import * as jwt from "jsonwebtoken";
import { Error } from "mongoose";
import { getEnvironment } from "../environments/env";
import Team from "../models/Team";
import User from "../models/User";

export class GlobalMiddleWare {
  static checkError(req, res, next) {
    const error = validationResult(req);
    if (!error.isEmpty()) { 
      console.log({ error: error.array() });
      next(res.json({ error: error.array()}));
    } else {
      next();
    }
  }

  static async authenticate(req,res,next)
  {
      const authHeader = req.headers.authorization;
      const token = authHeader ? authHeader.slice(7,authHeader.length) : null;
      try
      {

          jwt.verify(token,process.env.SECRET_KEY,((err,decoded)=>
          {
              if(err)
              {
                  next(err);
              }else if(!decoded)
              {     req.errorStatus = 401;
                  next(new Error('User Not Authorised'));
              }else
                  {

                          req.user = decoded;

                          next();
                  }
          }))
      }catch (e){
          req.errorStatus = 401;
          console.log(e);
          next(e);

      }
  }

  // public authenticate =
  //   (...args) =>
  //   async (req, res, next) => {
  //     const authHeader = req.headers.authorization;
  //     const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
  //     try {
  //       jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
  //         if (err) {
  //           next(err);
  //         } else if (!decoded) {
  //           req.errorStatus = 401;
  //           next(new Error("UnAuthorised Access"));
  //         } else {
  //           const roles = [].concat(args).map((role) => role.toLowerCase());
  //           let doc = null;
  //           let role = "";
  //           if (!decoded && roles.includes("guest")) {
  //             role = "guest";
  //             return next();
  //           }
  //           if (roles.includes("user")) {
  //             role = "user";
  //             doc = await User.findOne({
  //               _id: decoded._id,
  //               isDeleted: false,
  //             });
  //           }
  //           if (!doc) throw new Error("INVALID_TOKEN");
  //           if (role) req[role] = doc.toJSON();
  //           next();
  //         }
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       const message =
  //         String(error.name).toLowerCase() === "error"
  //           ? error.message
  //           : "UNAUTHORIZED_ACCESS";
  //       return res.error(401, message);
  //     }
  //   };
}
