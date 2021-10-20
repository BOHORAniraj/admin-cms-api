import Joi from "joi";

const longStr = Joi.string().max(3000);
const shortStrNull = Joi.string().max(50).allow(null).allow("");
const _id = Joi.string().max(30);

const title = Joi.string().max(100).required();
const price = Joi.number().max(10000);
const date = Joi.date();
const qty = Joi.number().max(10000);

export const newProductValidation = (req, res, next) => {
	try {
		const schema = Joi.object({
			status: Joi.boolean(),
			title,
			price: price.required(),
			salePrice: price,
			saleStartDate: date.allow("").allow(null),
			saleEndData: date.allow("").allow(null),
			brand: shortStrNull,
			qty: qty.required(),
			description: longStr.required(),
			categories: Joi.string(),
		});

		const values = schema.validate(req.body);
		if (values.error) {
			return res.json({
				status: "error",
				message: values.error.message,
			});
		}

		req.body.categories = req.body.categories.split(",");
		next();
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

export const updateProductValidation = (req, res, next) => {
	try {
		const schema = Joi.object({
			_id,
			status: Joi.boolean(),
			title,
			price: price.required(),
			salePrice: price,
			saleStartDate: date.allow("").allow(null),
			saleEndData: date.allow("").allow(null),
			brand: shortStrNull,
			qty: qty.required(),
			description: longStr.required(),
			thumbnail: Joi.string().allow(""),
			categories: Joi.string(),
			imgToDelete: Joi.string().allow(""),
			existingImages: Joi.string().allow(""),

			images: Joi.string(),
		});

		const values = schema.validate(req.body);
		if (values.error) {
			return res.json({
				status: "error",
				message: values.error.message,
			});
		}

		req.body.categories = req.body.categories.split(",");
		req.body.imgToDelete = req.body.imgToDelete
			? req.body.imgToDelete.split(",")
			: [];
		req.body.existingImages = req.body.existingImages
			? req.body.existingImages.split(",")
			: [];
		next();
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};
