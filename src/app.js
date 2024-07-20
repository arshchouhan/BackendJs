import express from "express"
import cors from "cors"
import cookieParser from "cookieParser"
const app = new express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.urlencoded({limit:"16kb"}))//for cinfiguring url
app.use(express.json({limit:"16kb"}))//for cinfiguring data collected from form
app.use(express.static("Public"))//to serve static files
app.use(cookieParser())// for managing cookies
export {app}