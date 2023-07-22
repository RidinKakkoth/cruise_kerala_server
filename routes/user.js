const express=require("express")
const router=express.Router()
const {isUser}=require('../middleware/authentication')
const upload=require("../middleware/multer")


const{userSignUp,userSignin,userData,getBookings,bookedDates,addReview,updateProfile,updateProfilePic}=require('../controllers/userController')
const{singleView,getCruiseData}=require('../controllers/cruiseController')
const{orderCreate,verify}=require('../controllers/paymentController')



router.post('/userSignUp',userSignUp)
router.post('/userSignin',userSignin)
router.get('/single-view/:id',singleView)
router.get('/getUserData',isUser,userData)
router.get('/bookings',isUser,getBookings)
router.get('/cruise-data',getCruiseData)
router.get('/booked-dates',bookedDates)
router.post('/review',isUser,addReview)
router.post('/update-profile',isUser,updateProfile)
router.post('/user-pic',isUser, upload.single('image'), updateProfilePic);



router.post('/orders',isUser,orderCreate)
router.post('/verify',isUser,verify)







module.exports=router