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
const express_1 = __importDefault(require("express"));
const db_1 = require("../lib/db");
const bcrypt_1 = require("bcrypt");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const router = express_1.default.Router();
router.use(body_parser_1.default.json());
router.use((0, cors_1.default)());
dotenv_1.default.config();
const SECRET = process.env.JWT_SECRET;
const verifyUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        next();
    }
    else {
        console.log("no token");
        res.status(401).json({ error: "Unauthorized access" });
    }
};
router.get("/me", verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json("Authorised");
}));
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const students = yield db_1.db.student.findMany();
    if (students)
        return res.status(200).json({ students });
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    console.log(req.body);
    const hashedPass = yield (0, bcrypt_1.hash)(password, 10);
    try {
        const existingEmail = yield db_1.db.student.findUnique({
            where: { email: email },
        });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const newUser = yield db_1.db.student.create({
            data: {
                name: name,
                email: email,
                password: hashedPass,
            },
        });
        if (newUser)
            return res.status(200).json({ message: "Student created" });
    }
    catch (error) {
        return res.status(500).json({ message: "An error occured", error });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const studentExists = yield db_1.db.student.findUnique({
            where: {
                email: email,
            },
        });
        if (!studentExists) {
            return res
                .status(500)
                .json({ message: "Please create an account first" });
        }
        const confirmPassword = yield (0, bcrypt_1.compare)(password, studentExists.password);
        if (!confirmPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ email }, SECRET, { expiresIn: "1h" });
        return res
            .status(200)
            .json({ message: "Login Successful", token, userId: studentExists.id });
    }
    catch (error) {
        return res.status(500).json({ message: "An error occured", error });
    }
}));
router.get("/details/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const student = yield db_1.db.student.findUnique({
        where: {
            id: userId,
        },
    });
    if (student)
        res.status(200).json({ message: "Student found", student });
}));
router.get("/purchases/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const studentPurchases = yield db_1.db.purchase.findMany({
            where: {
                userId: userId,
            },
            include: {
                course: true,
            },
            orderBy: {
                createdAt: "asc"
            }
        });
        if (studentPurchases)
            return res.status(200).json({ studentPurchases });
    }
    catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
}));
router.put("/purchases/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, courseId } = req.body;
    try {
        const purchase = yield db_1.db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: userId,
                    courseId: courseId,
                },
            },
        });
        if (!purchase) {
            return res.status(404).json({ message: "Purchase not found" });
        }
        const updatedPurchase = yield db_1.db.purchase.update({
            where: {
                userId_courseId: {
                    userId: userId,
                    courseId: courseId,
                },
            },
            data: {
                isCompleted: !purchase.isCompleted,
            },
        });
        return res.status(200).json({ message: "Purchase updated successfully", updatedPurchase });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
