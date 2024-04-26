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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserWithId = exports.placeOrder = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const registerUserInput = zod_1.z.object({
    name: zod_1.z.string().min(1).max(14),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4).max(20),
});
const loginUserInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4).max(20),
});
function getHashedPassword(userPass) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash(userPass, 10); // Hash the password
        return hashedPassword.toString();
    });
}
//register user service
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userData = req.body;
            //input validation with zod
            let parsedUserData = registerUserInput.safeParse(userData);
            if (!parsedUserData.success) {
                return res.status(411).json({
                    error: "Wrong input! " + parsedUserData.error,
                });
            }
            let pass = yield getHashedPassword(userData.password);
            userData.password = pass;
            const newUser = yield prisma.user.create({
                data: Object.assign(Object.assign({}, userData), { orders: undefined }),
            });
        }
        catch (err) {
            console.log("user register failed .");
            return res
                .status(411)
                .send({ error: "user registration failed!" + err.message });
        }
        return res.status(200).send({ msg: "user registred!" });
    });
}
exports.registerUser = registerUser;
//login user service
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //input validation with zod
    let parsedUserData = loginUserInput.safeParse(req.body);
    if (!parsedUserData.success) {
        return res.status(411).json({
            error: "Incorrect Input! " + parsedUserData.error,
        });
    }
    try {
        // find user in db
        let userData = yield prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });
        if (!userData) {
            return res.status(411).json({
                error: "user not found! ",
            });
        }
        const hashPass = yield bcrypt_1.default.compare(req.body.password, userData.password);
        if (!hashPass) {
            return res.status(411).json({
                error: "Incorrect password! ",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: userData.id,
            email: userData.email,
        }, __1.JWT_SECRET);
        res.setHeader("Authorization", `Bearer ${token}`);
        res.status(200).send("Login successful");
    }
    catch (err) {
        return res.status(411).json({
            error: "Some unexpected error occurred! " + err,
        });
    }
});
exports.loginUser = loginUser;
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. update quantity -1 in grocery items table(might need to update many)
    // 2. create order in order table (with total value)
    // 3. insert entries in order item table for details
    //
    try {
        // Iterate over each product in the order
        for (const product of req.body.products) {
            // Decrease the quantity of the purchased item in the GroceryItem table
            yield prisma.groceryItem.update({
                where: { id: product.id },
                data: { quantity: { decrement: product.quantity } },
            });
        }
        // Calculate total price of the order
        const totalPrice = req.body.products.reduce((acc, product) => {
            return acc + product.price * product.quantity;
        }, 0);
        console.log("total price : " + totalPrice);
        console.log("user id : " + req.body.user.id);
        // Create a new entry in the Order table
        const newOrder = yield prisma.order.create({
            data: {
                userId: req.body.user.id, // Assuming userId is provided in the request body
                totalPrice: totalPrice,
                // Add other order details as needed
            },
        });
        //
        // Create entries in the OrderItem table for each product in the order
        for (const product of req.body.products) {
            yield prisma.orderItem.create({
                data: {
                    orderId: newOrder.id,
                    itemId: product.id,
                    quantity: product.quantity,
                },
            });
        }
        // Send a success response
        res
            .status(200)
            .json({ message: "Order placed successfully", order: newOrder });
    }
    catch (err) {
        return res
            .status(200)
            .json({ error: "There is an error while placing the order" + err });
    }
});
exports.placeOrder = placeOrder;
function findUserWithId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let userData = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        return userData;
    });
}
exports.findUserWithId = findUserWithId;
