"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
function authMiddleware(req, res, next) {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const tokenValue = token.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(tokenValue, __1.JWT_SECRET);
        req.headers.user = decoded;
        console.log(req.headers.user);
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}
exports.authMiddleware = authMiddleware;
