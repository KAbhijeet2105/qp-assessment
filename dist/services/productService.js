"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.deleteProduct = exports.createProduct = exports.getAllProducts = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const createProductInput = zod_1.z.object({
    name: zod_1.z.string().min(1).max(40),
    description: zod_1.z.string().min(5).max(200),
    price: zod_1.z.number(),
    quantity: zod_1.z.number(),
});
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let allProducts = yield prisma.groceryItem.findMany({ where: { quantity: { gt: 0 } } });
    if (!allProducts || allProducts.length === 0) {
        return res.status(411).json({
            error: "No products available in inventory! ",
        });
    }
    res.status(200).json({ products: allProducts });
});
exports.getAllProducts = getAllProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groceryItem = req.body;
    let parsedProdData = createProductInput.safeParse({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
    });
    if (!parsedProdData.success) {
        return res.status(411).json({
            error: "Wrong input! " + parsedProdData.error,
        });
    }
    let result = yield prisma.groceryItem.create({
        data: {
            name: groceryItem.name,
            description: groceryItem.description,
            price: groceryItem.price,
            quantity: groceryItem.quantity,
        },
    });
    if (!result) {
        return res.status(411).send({ error: "unable to add product!" });
    }
    return res.status(411).send(result);
});
exports.createProduct = createProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let productId = parseInt(req.params.id);
    try {
        const result = yield prisma.groceryItem.delete({
            where: { id: productId },
        });
        res
            .status(200)
            .json({ message: "Item deleted successfully", Item: result });
    }
    catch (err) {
        console.error("Error deleting the Item :", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteProduct = deleteProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = parseInt(req.params.id);
    const productUpdateData = req.body;
    try {
        const updateFields = {};
        Object.keys(productUpdateData).forEach((key) => {
            if (["quantity", "name", "description", "price"].includes(key)) {
                updateFields[key] = productUpdateData[key];
            }
        });
        const result = yield prisma.groceryItem.update({
            where: { id: productId },
            data: updateFields,
        });
        res
            .status(200)
            .json({ message: "Product updated successfully", product: result });
    }
    catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateProduct = updateProduct;
