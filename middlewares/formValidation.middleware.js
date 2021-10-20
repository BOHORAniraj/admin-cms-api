import Joi from "joi";

const plainShortStr = Joi.string().max(20).required();
const shortStr = Joi.string().max(20).alphanum().required();
const email = Joi.string().max(50).email({ minDomainSegments: 2 }).required();
const shortStrNull = Joi.string().max(30).allow(null).allow("");
const _id = Joi.string().max(30);
const password = Joi.string().min(8).required();

export const createAdminUserValidation = (req, res, next) => {
	console.log(req.body);
	// server side validation
	const schema = Joi.object({
		fname: shortStr,
		lname: shortStr,
		email: email,
		password,
		phone: Joi.string().max(15),
		address: Joi.string().max(100),
		dob: Joi.date().allow(null).allow(""),
		gender: Joi.string().max(6).allow(""),
	});

	const value = schema.validate(req.body);
	if (value.error) {
		return res.json({
			status: "error",
			message: value.error.message,
		});
	}
	next();
};

export const adminEmailVerificationValidation = (req, res, next) => {
	console.log(req.body);
	const schema = Joi.object({
		email: email,
		pin: Joi.string().min(6).required(),
	});

	const value = schema.validate(req.body);
	if (value.error) {
		return res.json({
			status: "error",
			message: value.error.message,
		});
	}
	next();
};

export const newCategoryValidation = (req, res, next) => {
	try {
		const schema = Joi.object({
			name: plainShortStr,
			parentCat: shortStrNull,
		});

		const value = schema.validate(req.body);
		if (value.error) {
			return res.json({
				status: "error",
				message: value.error.message,
			});
		}

		next();
	} catch (error) {
		res.json({
			status: "error",
			message: value.error.message,
		});
	}
};

export const updateCategoryValidation = (req, res, next) => {
	try {
		const schema = Joi.object({
			_id: _id.required(),
			name: plainShortStr,
			parentCat: shortStrNull,
		});

		const value = schema.validate(req.body);
		if (value.error) {
			return res.json({
				status: "error",
				message: value.error.message,
			});
		}

		next();
	} catch (error) {
		res.json({
			status: "error",
			message: value.error.message,
		});
	}
};

export const loginUserFormValidation = (req, res, next) => {
	try {
		const schema = Joi.object({
			email: email,
			password: plainShortStr,
		});

		const { error } = schema.validate(req.body);
		if (error) {
			return res.json({
				status: "error",
				message: error.message,
			});
		}

		next();
	} catch (error) {
		res.json({
			status: "error",
			message: "Error, Unable to process your request please try again lager",
		});
	}
};

export const passwordUpdateFormValidation = (req, res, next) => {
	try {
		const schema = Joi.object({
			currentPassword: password,
			password,
		});

		const { error } = schema.validate(req.body);
		if (error) {
			return res.json({
				status: "error",
				message: error.message,
			});
		}

		next();
	} catch (error) {
		res.json({
			status: "error",
			message: "Error, Unable to process your request please try again lager",
		});
	}
};

export const forgetPasswordResetFormValidation = (req, res, next) => {
	try {
		const schema = Joi.object({
			otp: shortStr,
			email,
			password,
		});

		const { error } = schema.validate(req.body);
		if (error) {
			return res.json({
				status: "error",
				message: error.message,
			});
		}

		next();
	} catch (error) {
		res.json({
			status: "error",
			message: "Error, Unable to process your request please try again lager",
		});
	}
};
