const express = require('express');
const router = express.Router();

const { partnerSignUp, partnerSignin, getPartnerData, updateProfilePic, proofUpload } = require("../controllers/partnerController");
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
router.get('/getPartnerData', getPartnerData);
router.post('/partner-dp', upload.single('image'), updateProfilePic);
router.post('/proof-upload', upload.single('file'), proofUpload);

router.post('/add-cruise', upload.fields([
    { name: 'license', maxCount: 1 },
    { name: 'images', maxCount: 5 } 
  ]),addCruiseData)

router.get('/cruise-data',getPartnerCruiseData)
router.patch('/blockCruise',blockCruise)



module.exports = router;
