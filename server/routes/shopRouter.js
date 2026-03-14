import express from "express"
import { getShop , createShop, updateShop } from "../controller/shopController.js";
import { protect } from "../middleware/Authorization/protect.js";

const shopRouter = express.Router();

shopRouter.get("/get-shop" , protect, getShop);
shopRouter.post("/create-shop" , protect , createShop);
shopRouter.put("/update-shop" , protect , updateShop)

export default shopRouter