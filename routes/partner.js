const express=require('express')

const router=express.Router()

const {partnerSignUp,partnerSignin,getPartnerData}=require("../controllers/partnerController")

router.post('/partnerSignUp',partnerSignUp)
router.post('/partnerSignin',partnerSignin)
router.get('/getPartnerData',getPartnerData)

module.exports =router