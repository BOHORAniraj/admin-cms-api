import express from "express";
const Router = express.Router();
import { creatUser, verifyEmail } from "../models/user-model/User.model.js";
import {
	createUniqueEmailConfirmation,
	findAdminEmailVerification,
	deleteInfo,
} from "../models/session/Session.model.js";
import {
	createAdminUserValidation,
	adminEmailVerificationValidation,
} from "../middlewares/formValidation.middleware.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";
import {
	sendEmailVerificationLink,
	sendEmailVerificationConfirmation,
} from "../helpers/email.helper.js";

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
export default Router;
