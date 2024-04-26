"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productService_1 = require("../services/productService");
const authMiddleware_1 = require("../middleware/authMiddleware");
const productRouter = express_1.default.Router();
productRouter.get("/getAllProducts", productService_1.getAllProducts);
productRouter.post("/createProduct", authMiddleware_1.authMiddleware, authMiddleware_1.isAdminCheck, productService_1.createProduct);
productRouter.delete("/deleteProduct/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdminCheck, productService_1.deleteProduct);
productRouter.patch("/updateProduct/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdminCheck, productService_1.updateProduct);
exports.default = productRouter;
