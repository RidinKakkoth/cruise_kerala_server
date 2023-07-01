const express=require('express')

const router=express.Router()

const {partnerSignUp,partnerSignin}=require("../controllers/partnerController")

router.post('/partnerSignUp',partnerSignUp)
router.post('/partnerSignin',partnerSignin)

module.exports =router