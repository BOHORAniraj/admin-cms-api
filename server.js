import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
const app = express();

import helmet from "helmet";
import cors from "cors";

const PORT = process.env.PORT || 8000;

// Connect MongoDB
import mongoClient from "./config/db.js";
mongoClient();

// middleware
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));
app.use(express.urlencoded());
app.use(express.json());

// load routers
import userRouter from "./routers/userRouter.js";
import categoryRouter from "./routers/categoryRouter.js";

// use routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);

app.use("/", (req, res) => {
	res.json({ message: "hello world" });
});

app.listen(PORT, error => {
	if (error) {
		return console.log(error);
	}

	console.log(`Server is running at http://localhost:${PORT}`);
});
