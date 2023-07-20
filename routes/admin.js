const express = require("express");
const {isAdmin}=require('../middleware/authentication')
const router = express.Router();

const {
  adminSignUP,
  adminSignin,
  getPartnerData,
  blockPartner,
  partnerApproval,
  getPartnerProfile,getBookings,getUserData,blockUser
} = require("../controllers/adminController");
const {
  cruiseApproval,
  addCategory,
  getCategories
} = require("../controllers/cruiseController");

router.post("/adminSignUp", adminSignUP);
router.post("/adminSignin", adminSignin);
router.get("/getPartnerData",isAdmin, getPartnerData);
router.get('/getPartnerProfile',isAdmin, getPartnerData);
router.get("/blockPartner",isAdmin, blockPartner);// patch
router.get("/blockUser",isAdmin, blockUser);// patch
router.get("/partner-approval",isAdmin, partnerApproval);//patch
router.get("/cruise-approval",isAdmin, cruiseApproval);//patch
router.post("/add-category",isAdmin, addCategory);
router.get("/get-categories",isAdmin, getCategories);
router.get("/get-userData",isAdmin, getUserData);
router.get("/get-bookings",isAdmin, getBookings);

router.get("/getPartnerProfileData",isAdmin, getPartnerProfile);

module.exports = router;
