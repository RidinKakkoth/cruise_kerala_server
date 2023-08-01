const express = require('express');
const router = express.Router();
const {isPartner}=require('../middleware/authentication')
const upload=require("../middleware/multer")

const { partnerSignUp, partnerSignin,resetPass, getPartnerData,getBookings, updateProfilePic,updateProfile, proofUpload,emailValid,getSingleCruiseData } = require("../controllers/partnerController");
const{getPartnerCruiseData,addCruiseData,blockCruise,getCategories,editCruiseData}=require("../controllers/cruiseController")
const{sendOTP,verifyOTP}=require('../controllers/otpController')


router.post('/partnerSignUp', partnerSignUp);
router.post('/partnerSignin', partnerSignin);
router.get('/getPartnerProfile',isPartner, getPartnerData);
router.post('/partner-dp',isPartner, upload.single('image'), updateProfilePic);
router.post('/proof-upload',isPartner, upload.single('file'), proofUpload);

router.post('/add-cruise',isPartner, upload.fields([
    { name: 'license', maxCount: 1 },
    { name: 'images', maxCount: 5 } 
  ]),addCruiseData)

router.post('/update-cruise',isPartner, upload.fields([
    { name: 'images', maxCount: 5 } 
  ]),editCruiseData)

  router.post("/sendOTP", sendOTP);
  router.post("/verifyOTP", verifyOTP);
  router.get("/emailTest", emailValid);
  router.post("/resetPassword", resetPass);

router.get("/get-categories",isPartner, getCategories);
router.get('/cruise-data',isPartner,getPartnerCruiseData)
router.get('/single-cruise-data',isPartner,getSingleCruiseData)
router.patch('/blockCruise',isPartner,blockCruise)//patch
router.patch('/update-profile',isPartner,updateProfile)
router.get("/get-bookings",isPartner, getBookings);



module.exports = router;
