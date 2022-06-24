import * as mongoose from "mongoose";
import { model } from "mongoose";

const invoiceSchema = new mongoose.Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "user" },
  teamId: { type: mongoose.Types.ObjectId, default: null, ref: "team" },
  clientId: { type: mongoose.Types.ObjectId, default: null, ref: "client" },
  invoiceType: {
    type: String,
    required: true,
    enum: ["standardInvoice", "recurringInvoice", "timeLogInvoice"],
  },
  invoice: { type: String, required: true },
  purchaseOrder: { type: String, required: true },
  InvoiceDate: { type: Date, default: new Date() },
  dueDate: { type: Date, default: new Date() },
  projectId: { type: mongoose.Types.ObjectId, default: null, ref: "work" },
  company: { type: mongoose.Types.ObjectId, default: null, ref: "company" },
  currency: { type: String },
  invoiceLanguage: { type: String },
  billingFrequently: {
    type: String,
    enum: [
      " Daily",
      "Week",
      "Weeks",
      "Monthly",
      "Quartey",
      "Half Year",
      "Yearly",
    ],
  },
  billingCycle: { type: Number },
  timeLogFrom: { type: Date },
  timeLogTo: { type: Date },
  itemName: { type: String },
  quantityHours: { type: Number },
  unitPrice: { type: String },
  tax: { type: mongoose.Types.ObjectId, default: null, ref: "tax" },
  description: { type: String },
  amount: { type: Number },
  totalAmount: { type: Number },
  note: { type: String },
  discount: { type: Number },
  roleAccess: {
    isView: { type: Boolean, default: true },
    isManage: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isTeam: { type: Boolean, default: false },
  },
  isDeleted: { type: Boolean, required: false },
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
});

export default model("invoice", invoiceSchema);
