import mongoose from 'mongoose'
// fname , lname,dob, email,phone,password,
const UserSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true,
        default: "",
        max:20
    },
    lname: {
        type: String,
        required: true,
        default: "",
        max:20
    },
    dob: {
        type:Date,
        
    },
    email: {
        type: String,
        required: true,
        default: "",
        max: 20,
        unique: true,
        index:1,
        
    },
    isEmailConfirmed: {
        type:Boolean,
        default:"false",
        
    },
    password: {
        type: String,
        required: true,
        default: "",
        min:8,
        
    },
    phone: {
        type: String,
        required: true,
        
    },
    address: {
        type: String,
        max:100,
    },
    gender: {
        type:String,
    },
    role: {
        type: String,
        required: true,
        default:"user",
    },


}, {
    timestamps:true,
})

const user = mongoose.model("User", UserSchema)
export default user;