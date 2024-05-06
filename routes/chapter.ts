import express from "express";
import { db } from "../lib/db";
import bodyParser from "body-parser";
import cors from "cors";

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());

router.post("/add", async (req, res) => {
  const { week, content, topic, courseId } = req.body;
  const chapter = await db.chapter.create({
    data: {
      week: week,
      topic: topic,
      content: content,
      courseId: courseId,
    },
  });
  if (chapter) return res.status(200).json({ message: "Chapter created" });
});

export default router