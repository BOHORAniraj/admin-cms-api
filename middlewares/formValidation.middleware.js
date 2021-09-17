import Joi from 'joi';

const sfname= Joi.string().max(20).required().alphanum();
const slname = Joi.string().required().max(20).alphanum();


export const createAdminUserValidation = (req, res, next) => {
    const schema = Joi.object({
        fname:sfname,
        lname:slname ,
        dob: Joi.date(),
        email: Joi.string().max(50).required().email({ minDomainSegments: 2 }),
        password: Joi.string().required().min(8),
        phone: Joi.string().required(),
        address: Joi.string().max(50),
        gender: Joi.string(),
        role:Joi.string().required(),


    })
    const value = schema.validate(req.body);
    // console.log(value);
    if (value.error) {
        return res.json({
            state: "error",
            message:value.error.message,
        })
    }
    next();

}

export const adminEmailVerification = (req, res, next) => {
    const schema = Joi.object({
       
        email: Joi.string().max(50).required().email({ minDomainSegments: 2 }),
        pin: Joi.string().required().min(6),
       

    })
    const value = schema.validate(req.body);
    // console.log(value);
    if (value.error) {
        return res.json({
            state: "error",
            message:value.error.message,
        })
    }
    next();
}