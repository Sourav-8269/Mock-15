const express=require("express");

const UserRouter=express.Router();

require("dotenv").config();

const {UserModel}=require("../models/User.model")

const bcrypt=require("bcrypt");

const jwt=require("jsonwebtoken")

UserRouter.get("/",async (req,res)=>{
    const user=await UserModel.find();
    res.send(user);
})

UserRouter.post("/userbyemail",async (req,res)=>{
    const {email}=req.body;
    const user=await UserModel.find({email});
    res.send(user);
})

UserRouter.post("/register",async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        await bcrypt.hash(password, 5, (err,result)=>{
           if(result){
               // console.log(result)
                
                const user=new UserModel({name,email,password:result});
                user.save();
                res.send("Registered Successfully")
           }else{
               console.log("Something went wrong while creating password hash")
           }
       });
       // console.log(hashpass)
   }catch(err){
       res.send("Something went wrong");
       console.log(err)
   }
})

UserRouter.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    
    try{
        const user=await UserModel.find({email});
        // console.log(hash)
        console.log(user)
        if(user.length>0){
            let hash=user[0].password;
            var token = jwt.sign({ UserID: user[0]._id },process.env.key);
    
            // console.log(token)
            bcrypt.compare(password, hash, (err,result)=>{
                // console.log(result,hash)
                if(result){
                    res.send({"msg":"Login Successfully","token":token})
                }else{
                    res.send("Password is Wrong");
                }
            });
        }else{
            res.send("Email Or Password is invalid")
        }
    }catch(err){
        res.send("Something went wrong");
        console.log(err)
    }
})

UserRouter.patch("/edit/:id",async (req,res)=>{
    const payload=req.body;
    const ID=req.params.id;
    try{
        await UserModel.findByIdAndUpdate({_id:ID},payload);
        res.send(`Updated User Successfully with id: ${ID}`);
    }catch(err){
        res.send("Something went wrong");
        console.log(err)
    }
})

module.exports={UserRouter};