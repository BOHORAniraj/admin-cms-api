import express from 'express'

import { createUser, verifyEmail } from '../models/user-model/User.model.js'
import {adminEmailVerification, createAdminUserValidation} from '../middlewares/formValidation.middleware.js'
import { hashPassword } from '../helpers/bcrypt.helper.js'

import { createUniqueEmailConfirmation, deleteInfo, findAdminEmailVerification } from '../models/session/Session.model.js';
import { emailProcessor, sendEmailVerificationConfirmation, sendEmailVerificationLink } from '../helpers/email.helper.js';


const Router = express.Router()
Router.post("/",createAdminUserValidation, async (req, res) => {
   
    try {
        const hashPass = hashPassword(req.body.password);
        if (hashPass) {
            req.body.password = hashPass

            const {_id,fname,email} = await createUser(req.body)
        
            if (_id) {

                //unique activation 
                const { pin } = await createUniqueEmailConfirmation(email);

                if (pin) {
                    const forSendingEmail = {
                        fname,
                        email,
                        pin,
                        
                    }
                    
                
                sendEmailVerificationLink(forSendingEmail);
            }

                return res.json({
                    state: 'success',
                    message: 'New user has been created successfully! we have send a email conformation to your email ,please check your email and follow the instructon to activate your account',
                })
            }
        }
        res.json({
            state: 'error',
            message:'Unable to create new user',
        })
    } catch (error) {
        let msg = "error unable to create new user"
        console.log(error)
        // if(error.message.include("E11000 duplicate key error collection"))
        res.json({
            state: "error",
            message:msg,
        });

    }
})

// email verification
Router.patch("/email-verification", adminEmailVerification, async (req, res) => {
    try {
        const result = await findAdminEmailVerification(req.body);
        console.log(result,"my veri email")
        if (result?._id) {
           
            const data = await verifyEmail(result.email)
            console.log(data,"my verify dta")
            if (data?._id) {
                deleteInfo(req.body);
                sendEmailVerificationConfirmation({
                    fname: data.fname,
                    email: data.email,
                })
                return res.json({
                    status: "success",
                    message:"your email has been verified you may login now",
                })

            }

            
        }
        res.json({
            status: "error",
            message:"your pin or email is invalid",
        })
        
    } catch (error) {
        res.json({
            status: "error",
            message:"Error , unable to verify the email, please try again later"
        })
        
    }
})

export default Router;