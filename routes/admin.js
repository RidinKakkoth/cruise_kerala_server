const express=require("express")

const router=express.Router()


const{adminSignUP,adminSignin,getPartnerData,blockPartner,partnerApproval}=require('../controllers/adminController')


router.post('/adminSignUp',adminSignUP)
router.post('/adminSignin',adminSignin)
router.get('/getPartnerData',getPartnerData)
router.patch('/blockPartner',blockPartner)
router.patch('/partner-approval',partnerApproval)






module.exports=router