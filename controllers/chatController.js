const  Admin  = require('../models/adminModel');
const Chat=require("../models/chatModel")
const jwt = require("jsonwebtoken");



const createChat=async(req,res)=>{  //=================================================
    try {

        const userId=req.id
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


const findUserChats=async (req,res)=>{  //==========================================done



    const userId=req.id
    try {
        
        const chats=await Chat.find({  userId  })

        return res.status(200).json(chats)


    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const findAdminChats=async(req,res)=>{ //=======================================
   
    const adminId=req.id
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
