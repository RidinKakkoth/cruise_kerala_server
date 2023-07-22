const express = require('express');
const router = express.Router();

const{createChat,findChat,findUserChats,findAdminChats}=require("../controllers/chatController")


router.post("/",createChat)
// router.get("/:userId",findUserChats)
router.get("/userChat",findUserChats)
router.get("/adminChat",findAdminChats)
router.get("/find/:firstId/:secondId",findChat)

module.exports=router;