const express=require("express")
const {isUser}=require('../middleware/authentication')


const router=express.Router()


const{userSignUp,userSignin,userData,getBookings,bookedDates}=require('../controllers/userController')
const{singleView,getCruiseData}=require('../controllers/cruiseController')
const{orderCreate,verify}=require('../controllers/paymentController')



router.post('/userSignUp',userSignUp)
router.post('/userSignin',userSignin)
router.get('/single-view/:id',singleView)
router.get('/getUserData',isUser,userData)
router.get('/bookings',isUser,getBookings)
router.get('/cruise-data',getCruiseData)
router.get('/booked-dates',bookedDates)


router.post('/orders',isUser,orderCreate)
router.post('/verify',isUser,verify)







module.exports=router