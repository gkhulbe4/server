import express from "express";
import { db } from "../lib/db";
import { compare, hash } from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import cors from "cors";
import { Request, Response, NextFunction, Router } from "express";

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());
dotenv.config();
const SECRET = process.env.JWT_SECRET!;

const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (token) {
    next();
  } else {
    console.log("no token");
    res.status(401).json({ error: "Unauthorized access" });
  }
};

router.get("/me", verifyUser, async (req, res) => {
  res.json("Authorised");
});

router.get("/all", async (req, res) => {
  const students = await db.student.findMany();
  if (students) return res.status(200).json({ students });
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  const hashedPass = await hash(password, 10);
  try {
    const existingEmail = await db.student.findUnique({
      where: { email: email },
    });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newUser = await db.student.create({
      data: {
        name: name,
        email: email,
        password: hashedPass,
      },
    });
    if (newUser) return res.status(200).json({ message: "Student created" });
  } catch (error) {
    return res.status(500).json({ message: "An error occured", error });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const studentExists = await db.student.findUnique({
      where: {
        email: email,
      },
    });
    if (!studentExists) {
      return res
        .status(500)
        .json({ message: "Please create an account first" });
    }
    const confirmPassword = await compare(password, studentExists.password);
    if (!confirmPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
    return res
      .status(200)
      .json({ message: "Login Successful", token, userId: studentExists.id });
  } catch (error) {
    return res.status(500).json({ message: "An error occured", error });
  }
});

router.get("/details/:userId", async (req, res) => {
  const userId = req.params.userId;
  const student = await db.student.findUnique({
    where: {
      id: userId,
    },
  });
  if (student) res.status(200).json({ message: "Student found", student });
});

router.get("/purchases/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const studentPurchases = await db.purchase.findMany({
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
    if (studentPurchases) return res.status(200).json({ studentPurchases });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error });
  }
});

router.put("/purchases/update", async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    const purchase = await db.purchase.findUnique({
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
    const updatedPurchase = await db.purchase.update({
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
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
