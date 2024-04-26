import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "..";
import bcrypt, { hash } from "bcrypt";
import { User } from "../model/User";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const registerUserInput = z.object({
  name: z.string().min(1).max(14),
  email: z.string().email(),
  password: z.string().min(4).max(20),
});

const loginUserInput = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(20),
});

async function getHashedPassword(userPass: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(userPass, 10); // Hash the password
  return hashedPassword.toString();
}

//register user service
export async function registerUser(req: Request, res: Response) {
  try {
    let userData: User = req.body;
    //input validation with zod
    let parsedUserData = registerUserInput.safeParse(userData);
    if (!parsedUserData.success) {
      return res.status(411).json({
        error: "Wrong input! " + parsedUserData.error,
      });
    }

    let pass = await getHashedPassword(userData.password);
    userData.password = pass;
    const newUser = await prisma.user.create({
      data: { ...userData, orders: undefined },
    });
  } catch (err: any) {
    console.log("user register failed .");
    return res
      .status(411)
      .send({ error: "user registration failed!" + err.message });
  }

  return res.status(200).send({ msg: "user registred!" });
}

//login user service

export const loginUser = async (req: Request, res: Response) => {
  //input validation with zod
  let parsedUserData = loginUserInput.safeParse(req.body);
  if (!parsedUserData.success) {
    return res.status(411).json({
      error: "Incorrect Input! " + parsedUserData.error,
    });
  }

  try {
    // find user in db
    let userData = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!userData) {
      return res.status(411).json({
        error: "user not found! ",
      });
    }

    const hashPass = await bcrypt.compare(req.body.password, userData.password);

    if (!hashPass) {
      return res.status(411).json({
        error: "Incorrect password! ",
      });
    }

    const token = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
      },

      JWT_SECRET
    );

    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).send("Login successful");
  } catch (err) {
    return res.status(411).json({
      error: "Some unexpected error occurred! " + err,
    });
  }
};

export const placeOrder = async (req: Request, res: Response) => {
  //basic operation flow:
  // 1. update quantity -1 in grocery items table(might need to update many)
  // 2. create order in order table (with total value)
  // 3. insert entries in order item table for details

  try {
    // Iterate over each product in the order
    for (const product of req.body.products) {
      // Decrease the quantity of the purchased item in the GroceryItem table
      await prisma.groceryItem.update({
        where: { id: product.id },
        data: { quantity: { decrement: product.quantity } },
      });
    }

    // Calculate total price of the order
    const totalPrice = req.body.products.reduce((acc: number, product: any) => {
      return acc + product.price * product.quantity;
    }, 0);

    // Create a new entry in the Order table
    const newOrder = await prisma.order.create({
      data: {
        userId: req.body.user.id,
        totalPrice: totalPrice,
      },
    });

    //
    // Create entries in the OrderItem table for each product in the order
    for (const product of req.body.products) {
      await prisma.orderItem.create({
        data: {
          orderId: newOrder.id,
          itemId: product.id,
          quantity: product.quantity,
        },
      });
    }

    res
      .status(200)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    return res
      .status(200)
      .json({ error: "There is an error while placing the order" + err });
  }
};

export async function findUserWithId(userId: number) {
  let userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return userData;
}
