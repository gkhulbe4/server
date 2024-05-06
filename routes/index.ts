import express from "express";
import studentRouter from "./student";
import courseRouter from "./course";
import chapterRouter from "./chapter"

const app = express();

app.use("/student" , studentRouter)
app.use("/course" , courseRouter)
app.use("/chapter" , chapterRouter)


const port =process.env.PORT || 3000

app.listen(port, () => console.log(`Server running on port ${port}`));