import express from "express";
import {validateRegister, validateLogin} from "../middleware/Joi/validateUser.js";
import {register , login} from "../controller/userController.js"
const userRouter = express.Router();

userRouter.post("/register",(req,res,next)=>{
    console.log("Register route hit");
    next();
}, validateRegister, register);
userRouter.post("/login", validateLogin, login);

export default userRouter;