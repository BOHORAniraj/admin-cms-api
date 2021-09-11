import Joi from 'joi';


export const createAdminUserValidation = (req, res, next) => {
    const schema = Joi.object({
        fname: Joi.string().max(20).required().alphanum(),
        lname: Joi.string().required().max(20).alphanum(),
        dob: Joi.date(),
        email: Joi.string().max(50).required().email({ minDomainSegments: 2 }),
        password: Joi.string().required().min(8),
        phone: Joi.string().required(),
        address: Joi.string().max(50),
        gender: Joi.string(),
        role:Joi.string().required(),


    })
    const value = schema.validate(req.body);
    console.log(value);
    if (value.error) {
        return res.json({
            state: "error",
            message:value.error.message,
        })
    }
    next();

}