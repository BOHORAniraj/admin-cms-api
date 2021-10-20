import ProductSchema from "./Product.schema.js";

export const getProducts = () => {
	return ProductSchema.find();
};
export const getProductBySlug = slug => {
	return ProductSchema.findOne({ slug });
};

export const addProduct = prodInfo => {
	return ProductSchema(prodInfo).save();
};

export const deleteProductById = _id => {
	return ProductSchema.findByIdAndDelete(_id);
};

export const updateProduct = (_id, product) => {
	return ProductSchema.findByIdAndUpdate(_id, product);
};
