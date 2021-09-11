import express from "express";
const app = express();
import helmet from 'helmet'

const PORT = process.env.PORT || 8000;

app.use(helmet());

app.use("/", (req, res) => {
    res.json({ message:"hello world" })
})

app.listen(PORT, (error) => {
    if (error) {
        return console.log(error)
    }
    console.log(`server is running at http://localhost:${PORT}`)
})