import mongoose from 'mongoose'

export const connectdb = async ()=>{
       await mongoose.connect('mongodb+srv://zola:Zolakali11@cluster0.qaehwkq.mongodb.net/billboard');
       console.log("db connected");
} 