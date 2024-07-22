import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = new express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.urlencoded({limit:"16kb"}))//for cinfiguring url
app.use(express.json({limit:"16kb"}))//for cinfiguring data collected from form
app.use(express.static("Public"))//to serve static files
app.use(cookieParser())// for managing cookies


//routes import

import userRouter from "./routes/user.routes.js"

//routes declaration
app.use("/api/v1/users",userRouter)

export {app}