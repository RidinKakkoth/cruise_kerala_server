const messageModel = require("../models/messageModel");
const Message=require("../models/messageModel")



const createMessage=async(req,res)=>{
   
    try {
console.log(req.body,"xxxxxxxxxxxxxxx");
        const {chatId,senderId,text}=req.body
        
        const message=new Message({
            chatId,senderId,text
        })
        
       const response= await message.save()
       res.status(200).json(response)

    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

//get message

const getMessage=async (req,res)=>{
    try {
      
        const{chatId}=req.params;

        const messages=await Message.find({chatId});
        res.status(200).json(messages)

    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

module.exports={createMessage,getMessage}