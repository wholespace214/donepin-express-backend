import Discussion from "../models/Discussion";
import * as moment from "moment";

export class DiscussionController {
  static async createDiscussion(req, res, next) {
    try {
      const adminId = req.user._id;
      const propertyId = req.property.id;
      const teamId = req.team.id;
      const memberId = req.user._id;

      const data = { adminId, teamId, propertyId, memberId };

      const doc = await new Discussion(data).save();

      if (doc) {
        res.status(200).json({ data: doc, status: true, message: "created" });
      } else {
        res.send("something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }

  static async getDiscussion(req, res, next) {
    try {
      const doc = await Discussion.find({});
      res.status(200).json({ data: doc, status: true, message: "found" });
    } catch (err) {
      next(err);
    }
  }

  // for user
  static async addDiscussion(req, res, next) {
    try {
      const propertyId = req.property.id;
      const teamId = req.team.id;
      const memberId = req.user._id;
      const DiscussionId = req.discussion.id;
      const comment = req.body.comment;
      const searchPath = req.file.path;
      const filename = req.file.originalname;
      const replacePath = "src/uploads/" + filename;

      const newPath = searchPath.replace(searchPath, replacePath);
      console.log(req.file);
      const fileUrl = `http://localhost:8001/${newPath}`;

      const data = await Discussion.findOneAndUpdate(
        { propertyId: propertyId, teamId: teamId,_id:DiscussionId },
        {
          updatedAt: Date.now(),
          comment: comment,
          image: fileUrl || '',
          $addToSet: { memberId: memberId },
        },
        { new: true }
      );
      if(data){
          res.status(200).json({data: data});
      }else{
          res.status(400).json({message:'unable to update something went wrong :> taskController->addDiscussion'});
      }
    } catch (err) {
      next(err);
    }
  }
}
