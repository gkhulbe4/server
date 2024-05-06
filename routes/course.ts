import express from "express";
import { db } from "../lib/db";
import bodyParser from "body-parser";
import cors from "cors";

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());

router.get("/all", async (req, res) => {
  const courses = await db.course.findMany();
  if (courses) return res.status(200).json({ courses });
});

router.post("/add", async (req, res) => {
  const {
    name,
    instructor_name,
    description,
    thumbnail,
    duration,
    schedule,
    location,
    prerequisites,
    price,
  } = req.body;
  try {
    const course = await db.course.create({
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
    if (!course) return res.status(500).json({ message: "ERROR" });
    return res.status(200).json({ message: "Course created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
});

router.post("/purchase", async (req, res) => {
  const { courseId, userId } = req.body;
  try {
    const courseStatus = await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        enrollmentStatus: true,
      },
    });
    if (courseStatus?.enrollmentStatus !== "OPEN")
      return res.status(400).json({ message: "Course enrollment is not open" });

    const existingPurchase = await db.purchase.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
      },
    });
    if (existingPurchase)
      return res
        .status(400)
        .json({ message: "You are already enrolled to this course" });

    const purchase = await db.purchase.create({
      data: {
        userId: userId,
        courseId: courseId,
      },
    });
    if (purchase)
      return res.status(200).json({ message: "You are now enrolled. Congratulations" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error });
  }
});

router.get("/details/:courseId", async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const courseDetails = await db.course.findUnique({
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

    const purchases = await db.purchase.count({
      where: {
        courseId: courseId,
      },
    });

    return res.status(200).json({ courseDetails, purchases });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error });
  }
});

export default router;
