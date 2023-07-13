const express=require("express")

const router=express.Router()


const{userSignUp,userSignin}=require('../controllers/userController')
const{singleView}=require('../controllers/cruiseController')



router.post('/userSignUp',userSignUp)
router.post('/userSignin',userSignin)
router.get('/single-view/:id',singleView)
// router.post('/adminSignin',adminSignin)







module.exports=router