import app from "./src/app.js";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
if(!MONGO_URI) console.log('mongo uri missing')
mongoose.connect(MONGO_URI).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
app.listen(3000,()=>{
    console.log('server running on port 3000')
})
