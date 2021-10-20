import express from "express";
const Router = express.Router();
import multer from "multer";
import slugify from "slugify";

import {
	addProduct,
	getProducts,
	getProductBySlug,
	deleteProductById,
	updateProduct,
} from "../models/product-model/Product.model.js";

import {
	newProductValidation,
	updateProductValidation,
} from "../middlewares/productFormValidation.middleware.js";

import { isAdminUser } from "../middlewares/auth.middleware.js";

Router.get("/:slug?", async (req, res) => {
	try {
		const { slug } = req.params;
		console.log(req.params, "sdsdf");
		const products = slug ? await getProductBySlug(slug) : await getProducts();

		res.json({
			status: "success",
			message: "Here is the product",
			products,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
});

// configure multer for validation and upload destination
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log(file);
		let error = null;
		//validation test

		cb(error, "public/img/products");
	},
	//group.png
	filename: function (req, file, cb) {
		const fileNameArg = file.originalname.split(".");
		const fileName = slugify(fileNameArg[0], { lower: true });

		const fullFileName = fileName + "-" + Date.now() + "." + fileNameArg[1];
		cb(null, fullFileName);
	},
});

const upload = multer({ storage });
// add new product
Router.post(
	"/",
	upload.array("images", 5),
	newProductValidation,
	async (req, res) => {
		try {
			//file zone
			const files = req.files;

			const images = [];

			const basePath = `${req.protocol}://${req.get("host")}/img/products/`;

			files.map(file => {
				const imgFullPath = basePath + file.filename;
				images.push(imgFullPath);
			});

			///

			console.log(images);
			const slug = slugify(req.body.title, { lower: true });
			const product = await addProduct({ ...req.body, slug, images });

			product?._id
				? res.json({
						status: "success",
						message: "New product has been added",
				  })
				: res.json({
						status: "error",
						message:
							"Unable to add the product at the moment, please try again later",
				  });
		} catch (error) {
			console.log(error);

			if (error.message.includes("E11000 duplicate key error collection")) {
				return res.json({
					status: "error",
					message: "Slug can not be sam age already existing product",
				});
			}
			res.status(500).json({
				status: "error",
				message: "Internal server error",
			});
		}
	}
);

Router.delete("/:_id", async (req, res) => {
	try {
		const { _id } = req.params;

		if (_id) {
			const result = await deleteProductById(_id);
			if (result?._id) {
				return res.json({
					status: "success",
					message: "Product has been deleted",
				});
			}
		}

		res.json({
			status: "error",
			message: "Product not found or Invalid request ",
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
});

// Update product
Router.put(
	"/",
	upload.array("images", 5),
	updateProductValidation,
	async (req, res) => {
		try {
			const { existingImages, imgToDelete, _id, ...product } = req.body;
			console.log(req.body);
			console.log(req.files);
			//file zone
			const files = req.files;
			let images = [];
			const basePath = `${req.protocol}://${req.get("host")}/img/products/`;

			///remove the image that to be deleted
			images = existingImages.filter(source => !imgToDelete.includes(source));

			////
			// new images coming
			files.map(file => {
				const imgFullPath = basePath + file.filename;
				images.push(imgFullPath);
			});

			const result = await updateProduct(_id, { ...product, images });

			result?._id
				? res.json({
						status: "success",
						message: "The product has been update",
				  })
				: res.json({
						status: "error",
						message: "Unable to update the product, please try again later",
				  });
		} catch (error) {
			console.log(error);

			res.status(500).json({
				status: "error",
				message: "Internal server error",
			});
		}
	}
);

export default Router;
