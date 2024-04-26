import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "..";
import { findUserWithId } from "../services/userService";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const tokenValue = token.split(" ")[1];
    const decoded = jwt.verify(tokenValue, JWT_SECRET);
    req.body.user = decoded;
   // console.log(req.headers.user);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export async function isAdminCheck(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.body.user.id; // check if user is admin from database.
  const userData = await findUserWithId(id);

  if (userData?.isAdmin) {
    console.log("admin access approved!");
    next();
  } else {
    res.status(403).json({ error: "Access Denied" });
  }
}
