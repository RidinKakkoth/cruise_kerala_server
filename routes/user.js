const express=require("express")

const router=express.Router()


const{userSignUp}=require('../controllers/userController')



router.post('/userSignUp',userSignUp)
// router.post('/adminSignin',adminSignin)







module.exports=router