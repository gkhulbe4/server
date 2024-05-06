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
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { week, content, topic, courseId } = req.body;
    const chapter = yield db_1.db.chapter.create({
        data: {
            week: week,
            topic: topic,
            content: content,
            courseId: courseId,
        },
    });
    if (chapter)
        return res.status(200).json({ message: "Chapter created" });
}));
exports.default = router;
