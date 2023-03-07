const express=require("express");

const JobRouter=express.Router();

require("dotenv").config();

const { JobModel } = require("../models/Job.model");

// JobRouter.get("/",async (req,res)=>{
//     const jobs=await JobModel.find();
//     res.send(jobs);
// })

JobRouter.get("/",async(req,res)=>{
    const location=req.query.location;
    const contract =req.query.contract;
    console.log(location,contract)
    try{
        if(location!=undefined&&typeof(location)=="string"){
            const post=await JobModel.find({location});
            res.send(post);
        }else if(contract!=undefined&&typeof(contract)=="string"){
            const post=await JobModel.find({contract});
            res.send(post);
        }else{
            const post=await JobModel.find();
            res.send(post);

        }
    }catch(err){
        res.send("Something Went Wrong");
        console.log(err);

    }
})

JobRouter.get("/search", async (req, res) => {
    
    console.log(req.query.q)
    try {
        let data=await JobModel.find({
            "$or":[
                {companyName:{$regex:req.query.q}}
            ]
          })
          res.send(data)
          
        
        
    } catch (error) {
        console.log(error)
    }
})

JobRouter.post("/add",async(req,res)=>{
    const {companyName,position,contract,location,image}=req.body;
    try{
            const jobs=new JobModel({companyName,position,contract,location,image});
            jobs.save();
            res.send("Added Job Successfully")
   }catch(err){
       res.send("Something went wrong");
       console.log(err)
   }
})

JobRouter.patch("/edit/:id",async (req,res)=>{
    const payload=req.body;
    const ID=req.params.id;
    try{
        await JobModel.findByIdAndUpdate({_id:ID},payload);
        res.send(`Updated Job Successfully with id: ${ID}`);
    }catch(err){
        res.send("Something went wrong");
        console.log(err)
    }
})

JobRouter.delete("/delete/:id",async (req,res)=>{
    const ID=req.params.id;
    try{
        await JobModel.findByIdAndDelete({_id:ID});
        res.send(`Deleted Job Successfully with id: ${ID}`);
    }catch(err){
        res.send("Something went wrong");
        console.log(err)
    }
})

module.exports={JobRouter};