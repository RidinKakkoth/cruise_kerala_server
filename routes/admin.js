const express=require("express")

const router=express.Router()


const{adminSignUP,adminSignin}=require('../controllers/adminController')


router.post('/adminSignUp',adminSignUP)
router.post('/adminSignin',adminSignin)






module.exports=router