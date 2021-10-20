import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
const app = express();

import path from "path";

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

//server static content
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import { isAdminUser } from "./middlewares/auth.middleware.js";

// load routers
import userRouter from "./routers/userRouter.js";
import categoryRouter from "./routers/categoryRouter.js";
import tokenRouter from "./routers/tokenRouter.js";
import productRouter from "./routers/productRouter.js";
import paymentOptionRouter from "./routers/paymentOptionRouter.js";
// use routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", isAdminUser, categoryRouter);
app.use("/api/v1/token", tokenRouter);
app.use("/api/v1/product", isAdminUser, productRouter);
app.use("/api/v1/payment-option", isAdminUser, paymentOptionRouter);

app.use("/", (req, res) => {
	res.json({ message: "hello world" });
});

app.listen(PORT, error => {
	if (error) {
		return console.log(error);
	}

	console.log(`Server is running at http://localhost:${PORT}`);
});
