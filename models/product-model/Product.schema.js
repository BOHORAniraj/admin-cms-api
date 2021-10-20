import mongoose from "mongoose";

//title, price, salePrice, saleStartDate, saleEndData brand, qty, status, thumbnail, images, description, categories, slug,
const ProductSchema = mongoose.Schema(
	{
		status: {
			type: Boolean,
			default: false,
			required: true,
		},
		title: {
			type: String,
			default: "",
			maxLength: 100,
			required: true,
		},
		slug: {
			type: String,
			required: true,
			maxLength: 100,
			default: "",
			unique: true,
			index: 1,
		},
		price: {
			type: Number,
			default: 0,
			max: 10000,
			required: true,
		},
		salePrice: {
			type: Number,
			default: 0,
			max: 10000,
		},
		saleStartDate: {
			type: Date,
			default: null,
		},
		saleEndData: {
			type: Date,
			default: null,
		},
		brand: {
			type: String,
			maxLength: 50,
			default: "",
		},
		qty: {
			type: Number,
			default: 0,
			max: 10000,
			required: true,
		},
		thumbnail: {
			type: String,
			default: "",
			maxLength: 1000,
		},
		images: {
			type: Array,
		},
		description: {
			type: String,
			required: true,
			maxLength: 3000,
			default: "",
		},
		categories: {
			type: Array,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Product", ProductSchema);
