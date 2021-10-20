import PaymentOptionSchema from "./PaymentOption.schema.js";

export const storePaymentOption = paymentObj => {
	return PaymentOptionSchema(paymentObj).save();
};

export const getAllPaymentOption = () => {
	return PaymentOptionSchema.find();
};
export const getPaymentOption = _id => {
	return PaymentOptionSchema.findById(_id);
};

export const removePaymentOption = _id => {
	return PaymentOptionSchema.findByIdAndRemove(_id);
};
