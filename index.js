const express=require("express");

require("dotenv").config();

const cors=require("cors");


const {connection}=require("./configs/db");
const { UserRouter } = require("./Routes/User.route");
const { JobRouter } = require("./Routes/Job.route");

const app=express();

app.use(cors());

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Welcome To Job Listing App");
})

app.use("/users",UserRouter);

app.use("/jobs",JobRouter);

app.listen(process.env.port,async ()=>{
    try{
        await connection;
        console.log("Connected to DB");
    }catch(err){
        // res.send("Something went wrong");
        console.log(err)
    }
})