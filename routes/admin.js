const express=require("express")

const router=express.Router()


const{adminSignUP,adminSignin,getPartnerData,blockPartner,partnerApproval,getPartnerProfile}=require('../controllers/adminController')
const{getCruiseData,cruiseApproval}=require('../controllers/cruiseController')


router.post('/adminSignUp',adminSignUP)
router.post('/adminSignin',adminSignin)
router.get('/getPartnerData',getPartnerData)
router.patch('/blockPartner',blockPartner)
router.patch('/partner-approval',partnerApproval)
router.patch('/cruise-approval',cruiseApproval)
router.get('/cruise-data',getCruiseData)


router.get('/getPartnerProfileData',getPartnerProfile)






module.exports=router