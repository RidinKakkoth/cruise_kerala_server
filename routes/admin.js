const express=require("express")

const router=express.Router()


const{adminSignUP,adminSignin,getPartnerData}=require('../controllers/adminController')


router.post('/adminSignUp',adminSignUP)
router.post('/adminSignin',adminSignin)
router.get('/getPartnerData',getPartnerData)






module.exports=router