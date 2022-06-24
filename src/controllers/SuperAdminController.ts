import User from "../models/User";
import Plans from "../models/Plans";
import Work from "../models/Work";
import Invoice from "../models/Invoice";
import fs = require("file-system");
import { parseIsolatedEntityName } from "typescript";
const niceInvoice = require("nice-invoice");

export class SuperAdminController {
  //(User Section)

  //get users
  static async getUsers(req, res, next) {
    try {
      const Userquery = req.query.id
        ? User.findOne({ _id: req.query.id }, { password: 0 })
        : User.find({}, { password: 0 });
      const getUsers = await Userquery;

      res.status(200).json({
        Status_code: 200,
        message: "Users Fetched successfully",
        data: { getUsers },
      });
    } catch (error) {
      next(error);
    }
  }

  //Update Anything about user as superAdmin
  static async updateUser(req, res, next) {
    const _id = req.params.id;
   const plan=req.body
    try {
      const users = await User.findByIdAndUpdate(
        { _id },
        {$push:{plan:plan}},
        {
          ...req.body,
        }
      );
      res.status(200).json({
        Status_code: 200,
        message: "User Updated successfully",
        data: { users },
      });
    } catch (error) {
      console.log(error);
    }
  }
  //(WorkSpace Section)

  //get workspaces//
  static async workSpace(req, res, next) {
    try {
      let { page, size } = req.query;
      if (!page) {
        page = 1;
      }
      if (!size) {
        size = 10;
      }
      const limit = parseInt(size);
      const skip = (page - 1) * size;
      const workSpace = await Work.find({})
        .limit(limit)
        .skip(skip)
        .populate("teamId");
      res.status(200).json({
        Status_code: 200,
        message: "members Fetched successfully",
        data: { workSpace },
      });
    } catch (error) {
      console.log(error);
    }
  }

  //update WorkSpace as superAdmin
  static async updateWork(req, res, next) {
    const adminId = req.body.adminId;
    try {
      const work = await Work.updateOne(
        { _id: req.params.id },
        {
          ...req.body,
        }
      );
      res.json({
        Status_code: 200,
        message: "Updated Successfully",
        data: { work, ...req.body },
      });
    } catch (error) {
      console.log(error);
    }
  }
  //(Payment Section)

  //get payments
  static async getPayments(req, res, next) {
    try {
      const payments = await Invoice.find({});
      res.json({
        Status_code: 200,
        message: "hello there",
        data: { payments },
      });
    } catch (error) {
      console.log(error);
    }
  }

  //update payments as SuperAdmin

  static async updatePayments(req, res, next) {
    const id = req.params.id;
    try {
      const pay = await Invoice.updateOne({ id }, { ...req.body });
      res.json({
        Status_code: 200,
        message: "payment updated successfully",
        data: { pay },
      });
    } catch (error) {
      console.log(error);
    }
  }

  //pdf generator byID
  static async GeneratePDF(req, res, next) {
    const id = req.params.id;

    try {
      const invoice = await Invoice.findOne({ _id: id }).populate("company");
      res.json({
        Status_code: 200,
        message: "invoice data is ours",
        data: { invoice },
      });
      const invoiceDetail = {
        shipping: {
          name: invoice.company.companyName,
          address: invoice.company.Address,
          city: "Dubai",
          state: "Dubai",
          country: "UAE",
          postal_code: 94111,
        },
        items: [
          {
            item: "Satyam gandu",
            description: "Lelo Free",
            quantity: 1,
            price: 50.0,
            tax: "6%",
          },
        ],
        subtotal: 50,
        total: 53,
        order_number: invoice.invoice,
        header: {
          company_name: "Development Invoice",
          company_logo: "logo.png",
          company_address:
            "Nice Invoice. 123 William Street 1th Floor New York, NY 123456",
        },
        footer: {
          text: "This is footer - you can add any text here",
        },
        currency_symbol: "$",
        date: {
          billing_date: invoice.InvoiceDate,
          due_date: invoice.dueDate,
        },
      };
      niceInvoice(invoiceDetail, `${invoice.company.companyName}.pdf`);
      console.log("done");
    } catch (error) {
      console.log(error);
    }
  }

  /////(plan Section)

  //create plans
  static async CreatePlans(req, res, next) {
    const planName = req.body.planName;
    const versionName = req.body.versionName;
    const discription = req.body.discription;
    const status = req.body.status;
    const price = req.body.price;
    try {
      const plan = await Plans.find({versionName})
      if(plan.length > 0){
        res.json({
              status_code: 400,
              message: "versionName already existed",
            });
      }else{
        const planData = await new Plans({
          planName: planName,
          versionName: versionName,
          discription: discription,
          status:status,
          price: price,
        });
        planData.save();
        res.status(200).json({
          status_code: 200,
          message: "plan created successfully",
          data: { planData },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  ///edit plans
  static async updatePlan(req, res, next) {
    const id = req.params.id;
    try {
      const update = await Plans.findOneAndUpdate(
        { _id: id },
        {
          ...req.body,
        }
      );
      res.json({
        status_code: 200,
        message: "plan edited succesfully",
        data: { update },
      });
    } catch (error) {}
  }

  ///get plans
  static async getPlans(req, res, next) {
    try {
      const plan = await Plans.find({});
    res.json({
      status_code:200,
      message:"yeah we got it",
    })
    } catch (error) {
      console.log(error);
    }
  }




}
