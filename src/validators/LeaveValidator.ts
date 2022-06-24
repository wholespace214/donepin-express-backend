import { body, query , param } from "express-validator";
import Team from "../models/Team";
import User from "../models/User";
import Group from "../models/Group";
import Attendance from "../models/Attendance";
import Leave from "../models/Leave";

export class LeaveValidator {

    static createLeave (){
        return [
            param("memberId","member Id is required").custom((memberId,{req})=>{
                return Leave.findOne({memberId:memberId}).then((member)=>{
                    if(member){
                        req.member = member;
                        return true;
                    }else{
                        throw new Error("Invalid member Id");
                    }
                })
            }),
            param("teamId","team Id is required").custom((teamId,{req})=>{
                return Leave.findOne({teamId:teamId}).then((team)=>{
                    if(team){
                        req.team=team;
                    }else{
                        throw new Error("Invalid team Id");
                    }
                })
            }),
            body("totalLeaves","totalLeaves is required").isNumeric(),
        ]
    }
  
}
