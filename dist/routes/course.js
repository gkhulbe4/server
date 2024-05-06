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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const router = express_1.default.Router();
router.use(body_parser_1.default.json());
router.use((0, cors_1.default)());
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield db_1.db.course.findMany();
    if (courses)
        return res.status(200).json({ courses });
}));
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, instructor_name, description, thumbnail, duration, schedule, location, prerequisites, price, } = req.body;
    try {
        const course = yield db_1.db.course.create({
            data: {
                course_name: name,
                instructor_name: instructor_name,
                description: description,
                thumbnail: thumbnail,
                duration: duration,
                schedule: schedule,
                location: location,
                // enrollmentStatus: "CLOSED",
                prerequisites: prerequisites,
                price: price,
            },
        });
        if (!course)
            return res.status(500).json({ message: "ERROR" });
        return res.status(200).json({ message: "Course created" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred", error });
    }
}));
router.post("/purchase", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, userId } = req.body;
    try {
        const courseStatus = yield db_1.db.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                enrollmentStatus: true,
            },
        });
        if ((courseStatus === null || courseStatus === void 0 ? void 0 : courseStatus.enrollmentStatus) !== "OPEN")
            return res.status(400).json({ message: "Course enrollment is not open" });
        const existingPurchase = yield db_1.db.purchase.findFirst({
            where: {
                userId: userId,
                courseId: courseId,
            },
        });
        if (existingPurchase)
            return res
                .status(400)
                .json({ message: "You are already enrolled to this course" });
        const purchase = yield db_1.db.purchase.create({
            data: {
                userId: userId,
                courseId: courseId,
            },
        });
        if (purchase)
            return res.status(200).json({ message: "You are now enrolled. Congratulations" });
    }
    catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
}));
router.get("/details/:courseId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    try {
        const courseDetails = yield db_1.db.course.findUnique({
            where: {
                id: courseId,
            },
            include: {
                syllabus: true
            }
        });
        if (!courseDetails) {
            return res.status(404).json({ message: "Course not found" });
        }
        const purchases = yield db_1.db.purchase.count({
            where: {
                courseId: courseId,
            },
        });
        return res.status(200).json({ courseDetails, purchases });
    }
    catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
}));
exports.default = router;
