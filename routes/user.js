const express=require("express")
const router=express.Router()
const {isUser}=require('../middleware/authentication')
const upload=require("../middleware/multer")


const{userSignUp,userSignin,userData,getBookings,bookedDates,cancelBooking,addReview,updateProfile,updateProfilePic,emailValid,resetPass,applyCoupon,getCouponData,getCruiseOffer}=require('../controllers/userController')
const{singleView,getCruiseData}=require('../controllers/cruiseController')
const{orderCreate,verify}=require('../controllers/paymentController')
const{sendOTP,verifyOTP}=require('../controllers/otpController')



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

router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.get("/emailTest", emailValid);
router.post("/resetPassword", resetPass);
router.post("/apply-coupon", applyCoupon);

router.patch('/cancel-booking/:id',isUser,cancelBooking)


router.get("/get-cruise-offer",getCruiseOffer);
router.get("/get-coupon",getCouponData);

router.post('/orders',isUser,orderCreate)
router.post('/verify',isUser,verify)







module.exports=router