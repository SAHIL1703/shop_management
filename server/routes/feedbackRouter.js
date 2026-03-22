import express from "express"
import { validateFeedback } from "../middleware/Joi/validateFeedback.js";
import { getShopFeedback, sendFeedBack } from "../controller/feedbackController.js";
import { protect } from "../middleware/Authorization/protect.js";

const feedbackRouter = express.Router();

feedbackRouter.get("/:shopId" , protect, getShopFeedback)
feedbackRouter.post("/" , validateFeedback , sendFeedBack)

export default feedbackRouter;