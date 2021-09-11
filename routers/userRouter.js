import express from 'express'

import {createUser} from '../models/user-model/User.model.js'

const Router = express.Router()

Router.all("/", (req, res, next) => {
    console.log("from user router ");
    next();

})
Router.post("/",async (req, res) => {
    try {
        const result = await createUser(req, body)
        
        if (result?._id) {
            res.json({
                state: 'success',
                message:'New user has been created successfully',
            })
        }
        res.json({
            state: 'error',
            message:'Unable to create new user',
        })
    } catch (error) {
        console.log(error)
        res.json(error);

    }
})

export default Router;