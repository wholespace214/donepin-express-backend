import { body, query, param } from "express-validator";
import Work from "../models/Work";

export class WorkValidator {
  static getProjectById() {
    return [
      param("projectId", "projectId is required").custom((projectId, { req }) => {
        return Work.findOne({ _id: projectId }).then((project) => {
          if (project) {
            req.project = project;
          } else {
            throw new Error("Invalid work Id");
          }
        });
      }),
    ];
  }
}
