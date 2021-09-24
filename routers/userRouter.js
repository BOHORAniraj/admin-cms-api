import express, { json } from "express";
const Router = express.Router();
import {
	creatUser,
	verifyEmail,
	getUserByEmail,
} from "../models/user-model/User.model.js";
import {
	createUniqueEmailConfirmation,
	findAdminEmailVerification,
	deleteInfo,
} from "../models/rest-pin/Pin.model.js";
import {
	createAdminUserValidation,
	adminEmailVerificationValidation,
	loginUserFormValidation,
} from "../middlewares/formValidation.middleware.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import {
	sendEmailVerificationLink,
	sendEmailVerificationConfirmation,
} from "../helpers/email.helper.js";

import { getJWTs } from "../helpers/jwt.helper.js";

Router.all("/", (req, res, next) => {
	next();
});

Router.post("/", createAdminUserValidation, async (req, res) => {
	try {
		const hashPass = hashPassword(req.body.password);

		if (hashPass) {
			req.body.password = hashPass;

			const { _id, fname, email } = await creatUser(req.body);

			if (_id) {
				const { pin } = await createUniqueEmailConfirmation(email);

				if (pin) {
					const forSendingEmail = {
						fname,
						email,
						pin,
					};
					sendEmailVerificationLink(forSendingEmail);
				}

				return res.json({
					status: "success",
					message:
						"New user has been created successfully! WE have send a email confirmation to your email, please check and follow the instruction to activate your account",
				});
			}
		}
		res.json({
			status: "error",
			message: "Unable to created new user",
		});
	} catch (error) {
		let msg = "Error, Unable to created new user";

		if (error.message.includes("E11000 duplicate key error collection")) {
			msg = "This email has been used by another user.";
		}
		res.json({
			status: "error",
			message: msg,
		});
	}
});

//email verification
Router.patch(
	"/email-verification",
	adminEmailVerificationValidation,
	async (req, res) => {
		try {
			const result = await findAdminEmailVerification(req.body);

			if (result?._id) {
				const data = await verifyEmail(result.email);
				if (data?._id) {
					deleteInfo(req.body);
					sendEmailVerificationConfirmation({
						fname: data.fname,
						email: data.email,
					});
					return res.json({
						status: "success",
						message: "Your email has been verified, you may login now",
					});
				}
			}
			res.json({
				status: "error",
				message:
					"Unable to verify your email, either the link is invalid or expired",
			});
		} catch (error) {
			res.json({
				status: "error",
				message: "Error, Unable to verify the email, please try again later",
			});
		}
	}
);

// user login
Router.post("/login", loginUserFormValidation, async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await getUserByEmail(email);

		if (user?._id) {
			///check if password valid or not
			const isPassMatch = comparePassword(password, user.password);
			if (isPassMatch) {
				// get jwts then send to the client
				const jwts = await getJWTs({ _id: user._id, email: user.email });
				user.password = undefined;

				return res.json({
					status: "success",
					message: "login success",
					jwts,
					user,
				});
			}
		}

		res.status(401).json({
			status: "error",
			message: "unauthorized",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: "error",
			message: "Error, unable to login now, please try again later",
		});
	}
});
export default Router;
