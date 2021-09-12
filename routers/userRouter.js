import express from 'express'

import { createUser } from '../models/user-model/User.model.js'
import {createAdminUserValidation} from '../middlewares/formValidation.middleware.js'
import { hashPassword } from '../helpers/bcrypt.helper.js'

import { createUniqueEmailConfirmation } from '../models/session/Session.model.js';
import { emailProcessor } from '../helpers/email.helper.js';


const Router = express.Router()

// Router.all("/", (req, res) => {
//     console.log(req.body);

// })
Router.post("/",createAdminUserValidation, async (req, res) => {
    // console.log(req.body);
    try {
        // todo
        // server side validation
        // encrypt password
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
                    
                
                emailProcessor(forSendingEmail);
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

export default Router;