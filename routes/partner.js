const express = require('express');
const router = express.Router();
const {isPartner}=require('../middleware/authentication')
const upload=require("../middleware/multer")

const { partnerSignUp, partnerSignin, getPartnerData,getBookings, updateProfilePic,updateProfile, proofUpload } = require("../controllers/partnerController");
const{getPartnerCruiseData,addCruiseData,blockCruise,getCategories}=require("../controllers/cruiseController")



router.post('/partnerSignUp', partnerSignUp);
router.post('/partnerSignin', partnerSignin);
router.get('/getPartnerProfile',isPartner, getPartnerData);
router.post('/partner-dp',isPartner, upload.single('image'), updateProfilePic);
router.post('/proof-upload',isPartner, upload.single('file'), proofUpload);

router.post('/add-cruise',isPartner, upload.fields([
    { name: 'license', maxCount: 1 },
    { name: 'images', maxCount: 5 } 
  ]),addCruiseData)

router.get("/get-categories",isPartner, getCategories);
router.get('/cruise-data',isPartner,getPartnerCruiseData)
router.patch('/blockCruise',isPartner,blockCruise)//patch
router.patch('/update-profile',isPartner,updateProfile)
router.get("/get-bookings",isPartner, getBookings);



module.exports = router;
