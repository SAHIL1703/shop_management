import express from "express"
import { getShop , createShop, updateShop } from "../controller/shopController.js";
import { protect } from "../middleware/Authorization/protect.js";
import { validateShop } from "../middleware/Joi/validateShop.js";

const shopRouter = express.Router();

shopRouter.get("/get-shop" , protect, getShop);
shopRouter.post("/create-shop" , protect,validateShop , createShop);
shopRouter.patch("/update-shop" , protect,validateShop , updateShop)

export default shopRouter