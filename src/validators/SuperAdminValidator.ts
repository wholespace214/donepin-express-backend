import { body, query, param } from "express-validator";
import user from "../models/User"

export class SuperAdminValidator{

    static getUsers() {
        return [
          query("_id :_id is required").custom(
            (_id, { req }) => {
              return user.findOne({ _id: _id }).then((user) => {
                if (user) {
                  req.users = user;
                  return true;
                } else {
                  throw new Error("user does not exist");
                }
              });
            }
          ),
        ];
      }

      static updateUser() {
        return [
          query("email :email is required").custom(
            (email, { req }) => {
              return user.findOne({ email: email }).then((user) => {
                if (user) {
                  req.users = user;
                  return true;
                } else {
                  throw new Error("email does not exist");
                }
              });
            }
          ),
        ];
      }


}