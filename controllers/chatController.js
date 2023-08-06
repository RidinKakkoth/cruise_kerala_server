const  Admin  = require('../models/adminModel');
const Chat=require("../models/chatModel")
const jwt = require("jsonwebtoken");

const userVerification=(req,res)=>{

   
    if(!req.cookies||!req.cookies.userCookie){
        return res.status(401).json({error:"unAuthorized"}); 
      }
    const jwtToken=req.cookies.userCookie.token
  
    const decodedToken=jwt.verify(jwtToken,process.env.USER_SECRET_KEY)
  
    const userId=decodedToken.id
  
    return userId
  }
  const adminVerification = (req,res) => {
    if(!req.cookies||!req.cookies.adminCookie){
        return res.status(401).json({error:"unAuthorized"});
      
      }
    const jwtToken = req.cookies.adminCookie.token;
  
    const decodedToken = jwt.verify(jwtToken, process.env.ADMIN_SECRET_KEY);
  
    const adminId = decodedToken.id;
  
    return adminId;
  };


const createChat=async(req,res)=>{
    try {

        const userId = userVerification(req,res)
        const adminData=await Admin.findOne()
        const adminId=adminData._id

        const chat=await Chat.findOne({adminId,userId})
       

        if(chat) return res.status(200).json(chat)
        
        const newChat=new Chat({ adminId,  userId  })
        
        const response=await newChat.save()
        return res.status(200).json(response)

        
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }

}


const findUserChats=async (req,res)=>{

    const userId=userVerification(req,res)
    try {
        
        const chats=await Chat.find({  userId  })

        return res.status(200).json(chats)


    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const findAdminChats=async(req,res)=>{
    const adminId=adminVerification(req,res)
    try {
        
        const chats=await Chat.find({  adminId  }).populate("userId")

        return res.status(200).json(chats)


    } catch (error) {

        res.status(500).json(error)
    }
}


const findChat=async (req,res)=>{


    // const userId=req.params.userId
    const{firstId,secondId}=req.params



    try {
        
        const chat=await Chat.findOne({
            members:{$all:[firstId,secondId]}
        })
        return res.status(200).json(chat)


    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }

}


module.exports={createChat,findUserChats,findChat,findAdminChats}
