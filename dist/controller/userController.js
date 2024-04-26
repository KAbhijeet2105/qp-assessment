"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userService_1 = require("../services/userService");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
const adminRouter = express_1.default.Router();
exports.adminRouter = adminRouter;
userRouter.post("/register", userService_1.registerUser);
userRouter.post("/login", userService_1.loginUser);
userRouter.get("/userauth", authMiddleware_1.authMiddleware, (req, res) => {
    res.send(req.body.user);
});
userRouter.post("/placeOrder", authMiddleware_1.authMiddleware, userService_1.placeOrder);
adminRouter.get("/adminAuth", authMiddleware_1.authMiddleware, authMiddleware_1.isAdminCheck);
