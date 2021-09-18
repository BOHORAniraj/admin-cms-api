import express from "express";
const Router = express.Router();
import slugify from "slugify";

import {
	addCategory,
	getAllCats,
	getACat,
	deleteCat,
	updateCat,
} from "../models/category/Category.model.js";
import {
	newCategoryValidation,
	updateCategoryValidation,
} from "../middlewares/formValidation.middleware.js";

Router.all("/", (req, res, next) => {
	next();
	// res.json({
	// 	status: "success",
	// 	message: "from catalog router",
	// });
});

//return all or single category
Router.get("/:_id?", async (req, res) => {
	try {
		const { _id } = req.params;
		let result;

		if (_id) {
			result = await getACat(_id);
		} else {
			result = await getAllCats();
		}

		res.json({
			status: "success",
			message: "All the categories",
			categories: result || [],
		});
	} catch (error) {
		console.log(error);
		res.json({
			status: "error",
			message: error.message,
		});
	}
});

// Create new category
Router.post("/", newCategoryValidation, async (req, res) => {
	try {
		const slug = slugify(req.body.name, { lower: true });

		const result = await addCategory({ ...req.body, slug });

		const status = result?._id ? "success" : "error";
		const message = result?._id
			? "Category has been created successfully"
			: "Unable to create the Category, Please try again later";

		res.send({ status, message });
	} catch (error) {
		console.error(error.message);

		let msg =
			"Error, Unable to add new category at the moment, Please try again later";

		if (error.message.includes("E11000 duplicate key error collection")) {
			msg = "Error, the category already exist";
		}

		res.send({
			status: "error",
			message: msg,
		});
	}
});

//update category
Router.patch("/", updateCategoryValidation, async (req, res) => {
	try {
		//update database
		const result = await updateCat(req.body);
		console.log(result);

		if (result?._id) {
			return res.json({
				status: "success",
				message: "The category has been updated.",
			});
		}

		res.json({
			status: "error",
			message: "Unable to update the category please try again later",
		});
	} catch (error) {
		console.log(error);

		res.send({
			status: "error",
			message: "Error, Unable to delete the category",
		});
	}
});

//delete category
Router.delete("/:_id", async (req, res) => {
	try {
		const { _id } = req.params;

		const result = await deleteCat(_id);
		console.log(result);
		if (result?._id) {
			return res.json({
				status: "success",
				message: "The category has been deleted.",
			});
		}

		res.json({
			status: "error",
			message: "Invalid requests",
		});
	} catch (error) {
		console.log(error);

		res.send({
			status: "error",
			message: "Error, Unable to delete the category",
		});
	}
});

export default Router;
