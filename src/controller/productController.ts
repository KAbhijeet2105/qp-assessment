import express, { Request, Response } from "express";
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../services/productService";
import { authMiddleware, isAdminCheck } from "../middleware/authMiddleware";

const productRouter = express.Router();

productRouter.get("/getAllProducts", getAllProducts);

productRouter.post("/createProduct", authMiddleware,isAdminCheck,createProduct);

productRouter.delete("/deleteProduct/:id", authMiddleware,isAdminCheck,deleteProduct);

productRouter.patch("/updateProduct/:id",authMiddleware,isAdminCheck,updateProduct);

export default productRouter;
