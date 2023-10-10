const express = require('express');
const router = express.Router();

const{createMessage,getMessage}=require("../controllers/messageController")


// router.post("/",createMessage)
router.post("/send",createMessage)
router.get("/:chatId",getMessage)//done


module.exports=router;