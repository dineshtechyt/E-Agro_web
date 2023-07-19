
import mongoose from 'mongoose'
export const dbConnect=async()=>{
    try{
    await mongoose.connect("mongodb://0.0.0.0:27017/e-agro-web")
    console.log("successfully connected")
    }catch(error){
    
        console.log("something is wrong in connection")
    }
}