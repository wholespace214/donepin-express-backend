import { body, query, param } from "express-validator";
import Discussion from "../models/Discussion";

export class DiscussionValidator {
  static getDiscussionById() {
    return [
      param("discussionId", "discussionId is required").custom((discussionId, { req }) => {
        return Discussion.findOne({ _id: discussionId }).then((discussion) => {
          if (discussion) {
            req.discussion = discussion;
          } else {
            throw new Error("Invalid discussion Id");
          }
        });
      }),
    ];
  }

  static createDiscussion() {
    return [body("comment", "comment is required").isString()];
  }

//   static addFile() {
//     return [
//       body("file").custom((file, { req }) => {
//         console.log(req.file);
//         if (req.file) {
//           return true;
//         } else {
//           throw new Error("File not Uploaded");
//         }
//       })
//     ];
//   }
}
