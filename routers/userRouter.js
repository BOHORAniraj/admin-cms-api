import express from "express";
const Router = express.Router();
import {
	creatUser,
	verifyEmail,
	getUserByEmail,
	removeRefreshJWT,
	updateUserProfile,
	updateUserProfileByEmail,
} from "../models/user-model/User.model.js";
import {
	createUniqueEmailConfirmation,
	findAdminEmailVerification,
	deleteInfo,
} from "../models/rest-pin/Pin.model.js";
import { removeSession } from "../models/session/Session.model.js";

import {
	createAdminUserValidation,
	adminEmailVerificationValidation,
	loginUserFormValidation,
	passwordUpdateFormValidation,
	forgetPasswordResetFormValidation,
} from "../middlewares/formValidation.middleware.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import {
	sendEmailVerificationLink,
	sendEmailVerificationConfirmation,
	sendPasswordUpdateNotification,
} from "../helpers/email.helper.js";
import { isAdminUser } from "../middlewares/auth.middleware.js";
import { getJWTs } from "../helpers/jwt.helper.js";

Router.all("/", (req, res, next) => {
	next();
});

// return user
Router.get("/", isAdminUser, (req, res) => {
	req.user.password = undefined;
	req.user.refreshJWT = undefined;

	res.json({
		status: "success",
		message: "User profile",
		user: req.user,
	});
});

// create new user
Router.post("/", isAdminUser, createAdminUserValidation, async (req, res) => {
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

//update user
Router.patch("/", isAdminUser, async (req, res) => {
	try {
		const { _id } = req.user;

		if (_id) {
			const result = await updateUserProfile(_id, req.body);

			if (result?._id) {
				return res.json({
					status: "success",
					message: "User profile has been updated successfully.",
				});
			}
		}

		return res.json({
			status: "error",
			message: "Unable to update the user, please try again later",
		});
	} catch (error) {
		console.log(error);

		return res.json({
			status: "error",
			message: "Error, Unable to update the user, please try again later",
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

		if (user?._id && user?.role === "admin") {
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

// user logout
Router.post("/logout", async (req, res) => {
	try {
		const { accessJWT, refreshJWT } = req.body;
		accessJWT && (await removeSession(accessJWT));
		refreshJWT && (await removeRefreshJWT(refreshJWT));

		res.json({
			status: "success",
			message: "logging out ..",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: "error",
			message: "Error, unable to login now, please try again later",
		});
	}
});

//update password as a logged in user
Router.post(
	"/password-update",
	isAdminUser,
	passwordUpdateFormValidation,
	async (req, res) => {
		try {
			const { _id, password, fname, email } = req.user;
			const { currentPassword } = req.body;

			// make sure the current password matched in our database

			const passMatched = comparePassword(currentPassword, password);

			if (passMatched) {
				// encrypt the new password and store in db
				const hashedPass = hashPassword(req.body.password);
				if (hashedPass) {
					//update user table
					const user = await updateUserProfile(_id, { password: hashedPass });
					if (user._id) {
						res.json({
							status: "success",
							message: "Password has been updated",
						});
						// send notification email say password is update
						sendPasswordUpdateNotification({ fname, email });

						return;
					}
				}
			}

			res.json({
				status: "error",
				message:
					"Unable to update your password  at the moment, Please try agin later",
			});
		} catch (error) {
			console.log(error);
			res.json({
				status: "error",
				message: "Error, unable to process your request.",
			});
		}
	}
);

//reset forgot password
Router.post(
	"/reset-password",
	forgetPasswordResetFormValidation,
	async (req, res) => {
		try {
			const { otp, password, email } = req.body;

			/// valid opt and email exist in db
			const filter = { pine: otp, email };
			const hasOtp = await findAdminEmailVerification(filter);

			if (hasOtp?._id) {
				//encrypt the new password
				const hashedPass = hashPassword(password);
				if (hashedPass) {
					//update user table with the new password
					const user = await updateUserProfileByEmail(email, {
						password: hashedPass,
					});

					if (user?._id) {
						res.json({
							status: "success",
							message: "Password has been updated, you  may sign in now.",
						});

						// send notification email say password is update
						sendPasswordUpdateNotification({ email });

						deleteInfo(filter);

						return;
					}
				}
			}

			res.json({
				status: "error",
				message:
					"Unable to update your password  at the moment, Please try agin later",
			});
		} catch (error) {
			console.log(error);
			res.json({
				status: "error",
				message: "Error, unable to process your request.",
			});
		}
	}
);
export default Router;
