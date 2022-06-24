import * as express from "express";
import { config as dotenv } from "dotenv";
import * as mongoose from "mongoose";
import * as cors from "cors";
import * as helmet from "helmet";
import * as swaggerUi from "swagger-ui-express";
import { getEnvironment } from "./environments/env";
import bodyParser = require("body-parser");
import UserRouter from "./routers/UserRouter";
import LeaveRouter from "./routers/LeaveRouter";
import HolidayRouter from "./routers/HolidayRouter";
import WorkRouter from "./routers/WorkRouter";
import TaskRouter from "./routers/TaskRouter";
import DiscussionRouter from "./routers/DiscussionRouter";
import InvoiceRouter from "./routers/InvoiceRouter";
import CompanyRouter from "./routers/CompanyRouter";
import ClientRouter from "./routers/ClientRouter";
import SuperAdminRouter from "./routers/SuperAdminRouter";
const swaggerDocument = require("./swagger.json");

export class Server {
  public app: express.Application = express();

  constructor() {
    dotenv();
    this.setConfigurations();
    this.setRoutes();
    this.error404Handler();
    this.HandleErrors();
    this.setHeaders();
  }

  setConfigurations() {
    this.ConnectMongoDB();
    this.Configurations();
  }

  ConnectMongoDB() {
    const database_url = getEnvironment().db_url;
    mongoose.connect(process.env.MONGODB_URL).then(() => {
      console.log("mongodb is connected", process.env.MONGODB_URL);
    });
  }

  Configurations() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }

  setRoutes() {
    this.app.use("/src/uploads", express.static("src/uploads"));
    this.app.use("/user", UserRouter);
    this.app.use("/user", LeaveRouter);
    this.app.use("/user", HolidayRouter);
    this.app.use("/user", WorkRouter);
    this.app.use("/user", TaskRouter);
    this.app.use("/user", DiscussionRouter);
    this.app.use("/user", InvoiceRouter);
    this.app.use("/user", CompanyRouter);
    this.app.use("/user", ClientRouter);
    this.app.use("/user", SuperAdminRouter);
  }

  error404Handler() {
    this.app.use((req, res) => {
      console.log("error not found 404");
      res.status(404).json({
        message: "Not Found",
        Status_code: 404,
      });
    });
  }

  setHeaders() {
    this.app.use(function (req, res, next) {
      // Website you wish to allow to connect
      res.setHeader("Access-Control-Allow-Origin", "*");
      // Request methods you wish to allow
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
      );
      // Request headers you wish to allow
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,content-type"
      );
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      next();
    });
  }

  HandleErrors() {
    this.app.use((error, req, res, next) => {
      const errorstatus = req.errorStatus || 400;
      console.log(errorstatus);
      res.status(errorstatus).json({
        message: error.message || "Something Went Wrong. Please try Again!",
        status_code: errorstatus,
      });
    });
  }
}
