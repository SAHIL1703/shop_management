import express from "express";
import {validateRegister, validateLogin} from "../middleware/Joi/validateUser.js";
import {register , login} from "../controller/userController.js"
const userRouter = express.Router();

userRouter.get("/register", validateRegister, register);
userRouter.get("/login", validateLogin, login);

export default userRouter;