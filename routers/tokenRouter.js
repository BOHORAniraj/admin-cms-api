import express from "express";
const Router = express.Router();
import {
	getUserByEmailAndRefreshToken,
	getUserByEmail,
} from "../models/user-model/User.model.js";
import { createUniqueOtp } from "../models/rest-pin/Pin.model.js";
import { verifyRefreshJWT, createAccessJWT } from "../helpers/jwt.helper.js";
import { sendPasswordResetOTP } from "../helpers/email.helper.js";

Router.all("/", (req, res, next) => {
	console.log("token got hit");

	next();
});

Router.get("/", async (req, res) => {
	try {
		const { authorization } = req.headers;

		const { email } = verifyRefreshJWT(authorization);

		if (email) {
			const filter = {
				email,
				refreshJWT: authorization,
			};
			const user = await getUserByEmailAndRefreshToken(filter);
			if (user?._id) {
				const accessJWT = await createAccessJWT({ _id: user._id, email });

				return res.json({
					accessJWT,
				});
			}
		}

		res.status(401).json({
			status: "error",
			message: "Unauthenticated",
		});
	} catch (error) {
		console.log(error);
		res.status(401).json({
			status: "error",
			message: "Unauthenticated",
		});
	}
});

// request OTP for password reset
Router.post("/request-otp", async (req, res) => {
	try {
		//. get the email
		const { email } = req.body;

		// get the user by email
		if (email) {
			const user = await getUserByEmail(email);

			if (user?._id) {
				// create a opt and store in the token along with user _id,
				const result = await createUniqueOtp({
					email,
					type: "passwordResetOtp",
				});
				if (!result?._id) {
					return res.json({
						status: "error",
						message: "Please try again later",
					});
				}
				// send email with the OTP and then
				const emailObj = {
					email,
					otp: result.pin,
					fname: user.fname,
				};
				sendPasswordResetOTP(emailObj);
			}
		}

		res.json({
			status: "success",
			message:
				"If the email is exist in our system, we will send you an OTP shortly. Otp will expire in 15 min.",
		});
	} catch (error) {
		console.log(error);
		res.json({
			status: "error",
			message: "Error, unable to process your request.",
		});
	}
});

export default Router;
