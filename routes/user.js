const express=require("express")

const router=express.Router()


const{userSignUp,userSignin}=require('../controllers/userController')



router.post('/userSignUp',userSignUp)
router.post('/userSignin',userSignin)
// router.post('/adminSignin',adminSignin)







module.exports=router