const express = require('express');
const router = express.Router();
const {isPartner}=require('../middleware/authentication')

const { partnerSignUp, partnerSignin, getPartnerData, updateProfilePic,updateProfile, proofUpload } = require("../controllers/partnerController");
const{getPartnerCruiseData,addCruiseData,blockCruise}=require("../controllers/cruiseController")

const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/files"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  }
});

const upload = multer({ storage: storage });



router.post('/partnerSignUp', partnerSignUp);
router.post('/partnerSignin', partnerSignin);
router.get('/getPartnerProfile',isPartner, getPartnerData);
router.post('/partner-dp',isPartner, upload.single('image'), updateProfilePic);
router.post('/proof-upload',isPartner, upload.single('file'), proofUpload);

router.post('/add-cruise',isPartner, upload.fields([
    { name: 'license', maxCount: 1 },
    { name: 'images', maxCount: 5 } 
  ]),addCruiseData)

router.get('/cruise-data',isPartner,getPartnerCruiseData)
router.patch('/blockCruise',isPartner,blockCruise)
router.patch('/update-profile',isPartner,updateProfile)



module.exports = router;
