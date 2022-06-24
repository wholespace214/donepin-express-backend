import Invoice from "../models/Invoice";
import * as moment from "moment";
import {
  recurringInvoiceData,
  standardTypeData,
  timeLogInvoiceData,
} from "../common/static";
import Tax from "../models/Tax";

export class InvoiceController {
  static async createInvoice(req, res, next) {
    const adminId = req.user._id;
    const teamId = req.team.id;
    const standardData = standardTypeData(req.body, adminId, teamId);
    const recurringData = recurringInvoiceData(req.body, adminId, teamId);
    const timeLogData = timeLogInvoiceData(req.body, adminId, teamId);
    try {
      const invoice = await Invoice.findOne({
        adminId: adminId,
        teamId: teamId,
        invoiceType: req.body.invoiceType,
        invoice: req.body.invoice,
      });
     
      if (invoice) {
        throw new Error("Invoice is already available with this name");
      } else {
        if (req.body.invoiceType === "standardInvoice") {
          const doc = await new Invoice(standardData).save();
          res.status(200).json({
            Status_code: 200,
            message: "standard invoice created successfully",
            data: doc,
          });
        }
        if (req.body.invoiceType === "recurringInvoice") {
          let total = 0;
          for(let i = 0; i <= recurringData.item.length-1; i++) {
            console.log(recurringData.item[i].amount);
             total += recurringData.item[i].amount;
          }
          recurringData.totalAmount = total-(total * recurringData.discount/100);
           console.log("total amount",  recurringData);
          const doc = await new Invoice(recurringData).save();
          res.status(200).json({
            Status_code: 200,
            message: "recurring invoice created successfully",
            data: doc,
          });
          res.send(recurringData);
        }
        if (req.body.invoiceType === "timeLogInvoice") {
          let total = 0;
          for(let i = 0; i <= timeLogData.item.length-1; i++) {
            console.log(timeLogData.item[i].amount);
             total += timeLogData.item[i].amount;
          }
          timeLogData.totalAmount = total-(total * timeLogData.discount/100);
           console.log("total amount",  timeLogData);

          const doc = await new Invoice(timeLogData).save();
          res.status(200).json({
            Status_code: 200,
            message: "timeLogInvoice created successfully",
            data: doc,
          });
        }
      }
    } catch (e) {
      next(e);
    }
  }

  static async getInvoice (req, res, next){
      const adminId = req.user._id;
      const teamId = req.team.id;
      try{
        const data :any= await Invoice.find({adminId:adminId, teamId:teamId});
        if(data){
            res.status(200).json({
                Status_code: 200,
                message: "invoice found",
                data: data,
              });
        }else{
            res.status(400).json({message: "Invoice not found"});
        }
      }catch(e){
          next(e);
      }

  }

  static async updateInvoiceById (req, res, next) {
    const adminId = req.user._id;
    const teamId = req.team.id;
    const InvoiceId = req.params.invoiceId;
      try{
        const data = await Invoice.findOneAndUpdate({adminId: adminId, teamId: teamId,_id:InvoiceId},{
            ...req.body, updatedAt: Date.now()
        },{new:true});
        if(data){
            res.status(200).json({
                Status_code: 200,
                message: "invoice updated",
                data: data,
              });
        }else{
            res.status(400).json({message: "Invoice not found"});
        }
      }catch(e){
          next(e);
      }
  }

  static async updateSettingById (req, res, next) {
    const adminId = req.user._id;
    const teamId = req.team.id;
      try{
        const data = await Invoice.findOneAndUpdate({adminId: adminId, teamId: teamId},{
            ...req.body, updatedAt: Date.now()
        },{new:true});
        const taxData = await Tax.findOneAndUpdate({adminId: adminId, teamId: teamId},{
          ...req.body, updatedAt: Date.now()
        },{new:true});
            res.status(200).json({
                Status_code: 200,
                message: "Setting updated",
                data: data,
                taxData: taxData
              });
     
      }catch(e){
          next(e);
      }
  }

}
