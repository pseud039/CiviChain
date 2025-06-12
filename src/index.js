// require('dotenv').config({path:'./env'});
import dotenv from "dotenv";
import mongoose from "mongoose"
import { DB_NAME } from "./constant.js";
import connectDB from "./database/index.js";
// import app from "./app.js";
dotenv.config({
    path:'./env'})

    connectDB()
    .then(()=>{
        app.on("error",(error)=>{
            console.log("Error:",error);
            throw error
        })
        app.listen(process.env.PORT || 8000,()=>{
            console.log(`Server is running at port : ${process.env.PORT}`)
        });
    })
    .catch((err)=>{
        console.log("Mongo db connection failed",err);
    })
/*
(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    } catch (error) {
        console,log("Error",error);
        throw error
    }
})()*/