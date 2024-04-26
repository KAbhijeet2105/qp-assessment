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
exports.isAdminCheck = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
const userService_1 = require("../services/userService");
function authMiddleware(req, res, next) {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!__1.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const tokenValue = token.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(tokenValue, __1.JWT_SECRET);
        req.body.user = decoded;
        // console.log(req.headers.user);
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}
exports.authMiddleware = authMiddleware;
function isAdminCheck(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.user.id; // check if user is admin from database.
        const userData = yield (0, userService_1.findUserWithId)(id);
        if (userData === null || userData === void 0 ? void 0 : userData.isAdmin) {
            console.log("admin access approved!");
            next();
        }
        else {
            res.status(403).json({ error: "Access Denied" });
        }
    });
}
exports.isAdminCheck = isAdminCheck;
