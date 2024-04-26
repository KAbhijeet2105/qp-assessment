import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "..";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { GroceryItem } from "../model/GroceryItem";

const prisma = new PrismaClient();

const createProductInput = z.object({
  name: z.string().min(1).max(40),
  description: z.string().min(5).max(200),
  price: z.number(),
  quantity: z.number(),
});

export const getAllProducts = async (req: Request, res: Response) => {
  let allProducts = await prisma.groceryItem.findMany({ where: { quantity : {gt : 0}} });

  if (!allProducts || allProducts.length === 0) {
    return res.status(411).json({
      error: "No products available in inventory! ",
    });
  }
  res.status(200).json({ products: allProducts });
};

export const createProduct = async (req: Request, res: Response) => {
  const groceryItem: GroceryItem = req.body;

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

  let result = await prisma.groceryItem.create({
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
};

export const deleteProduct = async (req: Request, res: Response) => {
  let productId = parseInt(req.params.id);

  try {
    const result = await prisma.groceryItem.delete({
      where: { id: productId },
    });
    res
      .status(200)
      .json({ message: "Item deleted successfully", Item: result });
  } catch (err) {
    console.error("Error deleting the Item :", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  const productUpdateData = req.body;

  try {
    const updateFields: any = {};

    Object.keys(productUpdateData).forEach((key) => {
      if (["quantity", "name", "description", "price"].includes(key)) {
        updateFields[key] = productUpdateData[key];
      }
    });

    const result = await prisma.groceryItem.update({
      where: { id: productId },
      data: updateFields,
    });

    res
      .status(200)
      .json({ message: "Product updated successfully", product: result });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
