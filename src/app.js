import express from "express"
import session from 'express-session';
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
const app = new express()
app.use(session({
    secret: 'your-secret-key',
    resave: false, // Only save session if modified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: { secure: false } // Use HTTPS in production
}));

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.urlencoded({limit:"16kb",extended:true}))//for cinfiguring url
app.use(express.json({limit:"16kb"}))//for cinfiguring data collected from form
app.use(express.static("Public"))//to serve static files
app.use(cookieParser())// for managing cookies
app.use(express.static(path.join(path.resolve(), 'frontend')));

//routes import

import userRouter from "./routes/user.routes.js"

//routes declaration
app.use("/api/v1/users",userRouter)
app.get("/", (req, res) => {
    res.sendFile(path.join(path.resolve(), 'frontend', 'index.html'));
});
app.get("/frontend/loggedin.html", (req, res) => {
    res.sendFile(path.join(path.resolve(), 'frontend', 'loggedin.html'));
});




export {app}