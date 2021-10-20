import mongoose from "mongoose";

const PaymentOptionSchema = mongoose.Schema(
	{
		status: {
			type: Boolean,
			required: true,
			default: false,
		},
		name: {
			type: String,
			required: true,
			default: "",
		},
		info: {
			type: String,
			required: true,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Payment_option", PaymentOptionSchema);
