import mongoose from "mongoose";

const mongoClient = async () => {
    try {
        
        if (!process.env.MONGO_CLIENT) {
        return console.log("mongo client not defined please create mogo client")
        }
        const con = await mongoose.connect(process.env.MONGO_CLIENT);
        if (con) {
            return console.log("MONGO connected");
        }
            console.log("fail to connect monogo ")
    } catch (error) {
    console.log(error)
        
    }
}
export default mongoClient;