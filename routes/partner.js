const express = require('express');
const router = express.Router();
const { partnerSignUp, partnerSignin, getPartnerData, updateProfilePic, proofUpload, addCruiseData } = require("../controllers/partnerController");
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
// router.post('/add-cruise', upload.array('images', 5), upload.single('license'), addCruiseData);
// router.post('/add-cruise', upload.array('images', 5), upload.single('license'), addCruiseData);
router.post('/add-cruise', upload.fields([
    { name: 'license', maxCount: 1 },
    { name: 'images', maxCount: 5 } 
  ]),addCruiseData)

module.exports = router;
