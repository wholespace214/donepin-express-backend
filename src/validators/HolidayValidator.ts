import { body, query , param } from "express-validator";
import Team from "../models/Team";
import User from "../models/User";
import Group from "../models/Group";
import Attendance from "../models/Attendance";
import Leave from "../models/Leave";
import Holiday from "../models/Holiday";

export class HolidayValidator {

    static createHoliday (){
        return [
            param("teamId","team Id is required").custom((teamId,{req})=>{
                return Holiday.findOne({teamId:teamId}).then((team)=>{
                    if(team){
                        req.team=team;
                    }else{
                        throw new Error("Invalid team Id");
                    }
                })
            }),
            body("beginDate","beginDate is required").isDate().custom((beginDate,{req})=>{
               if(beginDate > req.body.endDate){
                   throw new Error("Invalid Date difference between beginDate and endDate");
               }else{
                   return true;
               }
            }),
            body("endDate","endDate is required").isDate(),
            body("occasion","occasion is required").isString()
        ]
    }
  
}
