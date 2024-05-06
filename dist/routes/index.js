"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const student_1 = __importDefault(require("./student"));
const course_1 = __importDefault(require("./course"));
const chapter_1 = __importDefault(require("./chapter"));
const app = (0, express_1.default)();
app.use("/student", student_1.default);
app.use("/course", course_1.default);
app.use("/chapter", chapter_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
