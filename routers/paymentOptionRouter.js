import express from "express";
const Router = express.Router();

import {
	storePaymentOption,
	getAllPaymentOption,
} from "../models/payment-options/PaymentOption.model.js";
import { newPaymentOptionValidation } from "../middlewares/paymentValidation.middleware.js";

Router.get("/", async (req, res) => {
	try {
		const result = await getAllPaymentOption();
		res.json({
			status: "success",
			message: "Here are the payment methods",
			options: result,
		});
	} catch (error) {
		return res.json({
			status: "error",
			message: "Error, Unable to process your request, please try agin later",
		});
	}
});

Router.post("/", newPaymentOptionValidation, async (req, res) => {
	try {
		const result = await storePaymentOption(req.body);
		if (result?._id) {
			return res.json({
				status: "success",
				message: "New payment option added successfully",
			});
		}

		return res.json({
			status: "error",
			message: "Unable to process your request, please try agin later",
		});
	} catch (error) {
		return res.json({
			status: "error",
			message: "Error, Unable to process your request, please try agin later",
		});
	}
});

export default Router;
