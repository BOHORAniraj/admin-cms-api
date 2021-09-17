import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan"
const app = express();
import helmet from 'helmet'
import cors from 'cors';


const PORT = process.env.PORT || 8000;
// connect mongodb
import mongoClient from "./config/db.js";
mongoClient();
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.urlencoded());
app.use(express.json());
app.use(cors())



import userRouter from "./routers/userRouter.js";

app.use("/api/v1/user", userRouter);

app.use("/", (req, res) => {
    res.json({ message:"hello world" })
})

app.listen(PORT, (error) => {
    if (error) {
        return console.log(error)
    }
    console.log(`server is running at http://localhost:${PORT}`)
})