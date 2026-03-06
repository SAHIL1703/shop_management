import express from "express";
import { validateRegister, validateLogin, validateUpdateUser } from "../middleware/Joi/validateUser.js";
import { register, login, updateUser, deleteUser } from "../controller/userController.js"
import { protect } from "../middleware/Authorization/protect.js";

const userRouter = express.Router();

userRouter.post("/register", validateRegister, register);
userRouter.post("/login", validateLogin, login);
userRouter.post("/update-user", protect, validateUpdateUser, updateUser);
userRouter.post("/delete-user", protect, deleteUser);

export default userRouter;