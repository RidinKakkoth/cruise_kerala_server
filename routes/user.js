const express=require("express")

const router=express.Router()


const{userSignUp,userSignin,userData,getBookings}=require('../controllers/userController')
const{singleView}=require('../controllers/cruiseController')
const{orderCreate,verify}=require('../controllers/paymentController')



router.post('/userSignUp',userSignUp)
router.post('/userSignin',userSignin)
router.get('/single-view/:id',singleView)
router.get('/getUserData',userData)
router.get('/bookings',getBookings)


router.post('/orders',orderCreate)
router.post('/verify',verify)







module.exports=router