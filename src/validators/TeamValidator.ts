import { body, query, param } from "express-validator";
import Team from "../models/Team";

export class TeamValidator {
  static getTeamById() {
    return [
      param("TeamId", "TeamId is required").custom((TeamId, { req }) => {
        return Team.findOne({ _id: TeamId }).then((team) => {
            console.log(team);
          if (team) {
            req.team = team;
          } else {
            throw new Error("Invalid team Id");
          }
        });
      }),
    ];
  }
}
