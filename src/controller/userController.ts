import express, { Request, Response } from "express";
import { loginUser, placeOrder, registerUser } from "../services/userService";
import { authMiddleware, isAdminCheck } from "../middleware/authMiddleware";

const userRouter = express.Router();
const adminRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/userauth", authMiddleware, (req: Request, res: Response) => {
  res.send(req.body.user);
});

userRouter.post("/placeOrder",authMiddleware,placeOrder);

adminRouter.get("/adminAuth", authMiddleware, isAdminCheck);

export { userRouter, adminRouter };
