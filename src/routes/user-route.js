import express from "express";
import authController from "../controllers/auth-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import userController from "../controllers/user-controller.js";

const userRouter = new express.Router();

userRouter.post("/auth/register", authController.register);
userRouter.post("/auth/login", authController.login);

userRouter.use(authMiddleware);
userRouter.post("/auth/logout", authController.logout);

userRouter.get("/user", userController.get);
userRouter.put("/user", userController.update);
userRouter.put("/user/change-password", userController.changePassword);

export { userRouter };
