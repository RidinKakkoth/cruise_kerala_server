const express=require("express")

const router=express.Router()


const{adminSignUP,adminSignin,getPartnerData,blockPartner,partnerApproval,getPartnerProfile}=require('../controllers/adminController')
const{getCruiseData}=require('../controllers/cruiseController')


router.post('/adminSignUp',adminSignUP)
router.post('/adminSignin',adminSignin)
router.get('/getPartnerData',getPartnerData)
router.patch('/blockPartner',blockPartner)
router.patch('/partner-approval',partnerApproval)
router.get('/cruise-data',getCruiseData)


router.get('/getPartnerData',getPartnerProfile)






module.exports=router