import express from "express"
import { protect } from "../middleware/Authorization/protect.js";
import { createLabor, disableLabor, getLabors, updateLabor } from "../controller/laborController.js";
import { validateLabor } from "../middleware/Joi/validateLabor.js";

const laborRouter = express.Router();
laborRouter.get("/:shopId" , protect , getLabors)
laborRouter.post("/",protect,validateLabor,createLabor);
laborRouter.put("/:shopId/:laborId" , protect, validateLabor,updateLabor)
laborRouter.patch("/:shopId/:laborId" , protect , disableLabor)
export default laborRouter;