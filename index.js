import express from "express";
import {config} from "dotenv"
import mongoose from "mongoose";
import cors from "cors"
import cookieParser from "cookie-parser";
import appRouter from "./route/route.js";
config()
const app= express()
app.use(cors({
  credentials:true,
  origin:true
}))
app.use(cookieParser())
app.use(express.json())
app.use('/api/v1',appRouter)
const dbConnect=async()=>{
  try{
   if(process.env.MONGODB_URL) {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('mongodb Connected')
   }
  }catch(e){
    console.log('mongoDb error',e)
  }
}
const startServer=async()=>{
  await dbConnect()
  app.listen(process.env.PORT,async()=>{
  console.log(`Server is running at ${process.env.PORT}`)
})
}
startServer()