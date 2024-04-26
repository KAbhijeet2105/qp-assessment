"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userController_1 = require("./controller/userController");
const productController_1 = __importDefault(require("./controller/productController"));
dotenv_1.default.config();
exports.JWT_SECRET = process.env.JWT_SECRET_KEY || '';
const app = (0, express_1.default)();
const port = process.env.APP_PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    console.log("root url hit!");
    res.send("Hello world!");
});
app.use("/user", userController_1.userRouter);
app.use("/admin", userController_1.adminRouter);
app.use("/products", productController_1.default);
app.listen(port, () => {
    console.log("listing to !", { port });
});
exports.default = app;
