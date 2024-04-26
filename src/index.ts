import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {userRouter,adminRouter} from "./controller/userController";
import productRouter from "./controller/productController";
dotenv.config();

export let JWT_SECRET :string = process.env.JWT_SECRET_KEY || '';


const app = express();
const port = process.env.APP_PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  console.log("root url hit!");
  res.send("Hello world!");
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/products",productRouter);


app.listen(port, () => {
  console.log("listing to !", { port });
});

export default app;
