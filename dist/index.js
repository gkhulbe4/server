"use strict";
// import express from "express";
// import jwt from "jsonwebtoken";
// import cors from "cors";
// import bodyParser, { json } from "body-parser";
// import dotenv from "dotenv";
// import { compare, hash } from "bcrypt";
// import { db } from "./lib/db";
// const app = express();
// app.use(bodyParser.json());
// app.use(cors());
// dotenv.config();
// const SECRET = process.env.JWT_SECRET!;
// //SIGNUP
// app.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;
//   console.log(req.body);
//   const hashedPass = await hash(password, 10);
//   try {
//     const existingEmail = await db.student.findUnique({
//       where: { email: email },
//     });
//     if (existingEmail) {
//       return res.status(400).json({ message: "Email already exists" });
//     }
//     const newUser = await db.student.create({
//       data: {
//         name: name,
//         email: email,
//         password: hashedPass,
//       },
//     });
//     if (newUser) return res.status(200).json({ message: "Student created" });
//   } catch (error) {
//     return res.status(500).json({ message: "An error occured", error });
//   }
// });
// // SIGNIN
// app.post("/signin", async (req, res) => {
//   const { email, password } = req.body;
//   console.log(req.body);
//   try {
//     const studentExists = await db.student.findUnique({
//       where: {
//         email: email,
//       },
//     });
//     if (!studentExists) {
//       return res
//         .status(500)
//         .json({ message: "Please create an account first" });
//     }
//     const confirmPassword = await compare(password, studentExists.password);
//     if (!confirmPassword) {
//       return res.status(400).json({ message: "Invalid password" });
//     }
//     const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
//     return res
//       .status(200)
//       .json({ message: "Login Successful", token, userId: studentExists.id });
//   } catch (error) {
//     return res.status(500).json({ message: "An error occured", error });
//   }
// });
// // ADD COURSE
// app.post("/addcourse", async (req, res) => {
//   const {
//     name,
//     instructor_name,
//     description,
//     thumbnail,
//     duration,
//     schedule,
//     location,
//     prerequisites,
//     price,
//   } = req.body;
//   try {
//     const course = await db.course.create({
//       data: {
//         course_name: name,
//         instructor_name: instructor_name,
//         description: description,
//         thumbnail: thumbnail,
//         duration: duration,
//         schedule: schedule,
//         location: location,
//         // enrollmentStatus: "CLOSED",
//         prerequisites: prerequisites,
//         price: price,
//       },
//     });
//     if (!course) return res.status(500).json({ message: "ERROR" });
//     return res.status(200).json({ message: "Course created" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error });
//   }
// });
// // ADD CHAPTER
// app.post("/addchapter", async (req, res) => {
//   const { week, content, topic, courseId } = req.body;
//   const chapter = await db.chapter.create({
//     data: {
//       week: week,
//       topic: topic,
//       content: content,
//       courseId: courseId,
//     },
//   });
//   if (chapter) return res.status(200).json({ message: "Chapter created" });
// });
// // PURCHASING A COURSE
// app.post("/purchase", async (req, res) => {
//   const { courseId, userId } = req.body;
//   try {
//     const courseStatus = await db.course.findUnique({
//       where: {
//         id: courseId,
//       },
//       select: {
//         enrollmentStatus: true,
//       },
//     });
//     if (courseStatus?.enrollmentStatus !== "OPEN")
//       return res.status(400).json({ message: "Course enrollment is not open" });
//     const existingPurchase = await db.purchase.findFirst({
//       where: {
//         userId: userId,
//         courseId: courseId,
//       },
//     });
//     if (existingPurchase)
//       return res
//         .status(400)
//         .json({ message: "User has already purchased this course" });
//     const purchase = await db.purchase.create({
//       data: {
//         userId: userId,
//         courseId: courseId,
//       },
//     });
//     if (purchase)
//       return res.status(200).json({ message: "Purchased successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// });
// // GET ALL COURSES
// app.get("/course/all", async (req, res) => {
//   const courses = await db.course.findMany();
//   if (courses) return res.status(200).json({ courses });
// });
// // GET ONE COURSE DETAILS
// app.get("/coursedetails", async (req, res) => {
//   const { courseId } = req.body;
//   const courseDetails = await db.course.findUnique({
//     where: {
//       id: courseId,
//     },
//   });
//   if (!courseDetails) {
//     return res.status(404).json({ message: "Course not found" });
//   }
//   const purchases = await db.purchase.count({
//     where: {
//       courseId: courseId,
//     },
//   });
//   return res.status(200).json({ courseDetails, purchases });
// });
// // GET STUDENT PURCHASES
// app.get("/student/purchases", async (req, res) => {
//   const { userId } = req.body;
//   const studentPurchases = await db.purchase.findMany({
//     where: {
//       userId: userId,
//     },
//     include: {
//       course: true,
//     },
//   });
//   if (studentPurchases) return res.status(200).json({ studentPurchases });
// });
// app.listen(3000, () => console.log("Server running on port 3000"));
