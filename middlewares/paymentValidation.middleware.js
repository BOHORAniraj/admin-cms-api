import Joi from "joi";

const longStr = Joi.string().max(3000);
const shortStrNull = Joi.string().max(50).allow(null).allow("");
const _id = Joi.string().max(30);
const title = Joi.string().max(100).required();
const price = Joi.number().max(10000);
const date = Joi.date();
const qty = Joi.number().max(10000);

export const newPaymentOptionValidation = (req, res, next) => {
	try {
		const schema = Joi.object({
			status: Joi.boolean().required(),
			name: title,
			info: Joi.string(),
		});

		const values = schema.validate(req.body);
		if (values.error) {
			return res.json({
				status: "error",
				message: values.error.message,
			});
		}

		next();
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};
