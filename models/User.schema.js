import mongoose from 'mongoose'
// fname , lname,dob, email,phone,password,
const UserSchema = mongoose.Schema({
    fname: {
        type: String,
        require: true,
        default: "",
        max:20
    },
    lname: {
        type: String,
        require: true,
        default: "",
        max:20
    },
    dob: {
        type:Date,
        
    },
    email: {
        type: String,
        require: true,
        default: "",
        max: 20,
        unique: true,
        index:1,
        
    },
    password: {
        type: String,
        require: true,
        default: "",
        min:8,
        
    },
    phone: {
        type: String,
        require: true,
        
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
        require: true,
        default:"user",
    },


}, {
    timestamps:true,
})

const user = mongoose.model("User", UserSchema)
export default user;