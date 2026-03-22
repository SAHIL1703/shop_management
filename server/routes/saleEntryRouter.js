import express from "express"
import { validateSaleEntry } from "../middleware/Joi/validateSaleEntry.js";
import { protect } from "../middleware/Authorization/protect.js";
import { addSales } from "../controller/saleEntryController.js";

const saleRouter = express.Router();

saleRouter.post("/", protect, validateSaleEntry, addSales);

export default saleRouter;