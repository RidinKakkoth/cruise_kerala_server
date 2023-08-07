const express = require('express');
const router = express.Router();
const {isUser}=require('../middleware/authentication')
const {isAdmin}=require('../middleware/authentication')

const{createChat,findChat,findUserChats,findAdminChats}=require("../controllers/chatController")


// router.post("/",isUser,createChat)
// router.get("/userChat",isUser,findUserChats)
// router.get("/adminChat",isAdmin,findAdminChats)
router.get("/find/:firstId/:secondId",findChat)

module.exports=router;