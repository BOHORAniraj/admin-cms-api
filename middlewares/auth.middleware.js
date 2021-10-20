import { verifyAccessJWT } from "../helpers/jwt.helper.js";
import { getSession } from "../models/session/Session.model.js";
import { getUserById } from "../models/user-model/User.model.js";

export const isAdminUser = async (req, res, next) => {
	try {
		const { authorization } = req.headers;

		if (authorization) {
			const decoded = verifyAccessJWT(authorization);

			if (decoded === "jwt expired") {
				return res.status(403).json({
					status: "error",
					message: "jwt expired",
				});
			}

			const session = decoded?.email
				? await getSession({ token: authorization })
				: null;

			if (session?._id) {
				const user = await getUserById(session.userId);

				if (user?.role === "admin") {
					req.user = user;

					next();
					return;
				}
				//get the admin user form db and check for the role
			}
		}

		return res.status(401).json({
			status: "error",
			message: "Unauthenticated",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Server error",
		});
	}
};
