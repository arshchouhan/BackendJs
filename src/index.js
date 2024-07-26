// require('dotenv').config()
import dotenv from "dotenv"
import connectdb from "./db/db.js"
import { app } from "./app.js"
dotenv.config({
    path:"./.env"})
/*(async ()=>{
    try{
        await mongoose.connect(`${process.env.MongoDb_URL}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("Error: ",error)
            throw err
        })
        app.listen(process.env.port,()=>
        {
            console.log("Port is listening at port ",port)
        })
    }
    catch(error)
    {
        console.error("Error",error)
        throw err
    }
})*/
connectdb()

.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port ${process.env.PORT}`)
    })
}) 
.catch((err)=>{
    console.log("Mongodb connection failed ",err)
})