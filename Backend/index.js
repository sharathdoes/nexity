const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const userRouter = require("./router/user");
const PostRouter = require("./router/Post")
const cors = require("cors");
dotenv.config();


mongoose.connect(process.env.MONGODB).then(()=>
console.log("DB connection successfull")).catch(()=>{
          console.log("Some erruor occured")
})

app.use(cors({
   
        origin: "http://localhost:3001", // Allow requests from React app
        methods: ["GET", "POST", "PUT", "DELETE"],
        
      
}));
app.use(express.json());
app.use("/api/user" , userRouter);
app.use("/api/post" , PostRouter )

app.listen(3000 , ()=>{
          console.log("Server is running")
})