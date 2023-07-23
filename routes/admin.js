const express = require("express");
const {isAdmin}=require('../middleware/authentication')
const router = express.Router();

const {
  adminSignUP,
  adminSignin,
  getPartnerData,
  getCruiseData,
  blockPartner,
  partnerApproval,
  getPartnerProfile,getBookings,getUserData,blockUser,getNotification,deleteNotification
} = require("../controllers/adminController");
const {
  cruiseApproval,
  addCategory,
  getCategories,blockCruise
} = require("../controllers/cruiseController");

router.post("/adminSignUp", adminSignUP);
router.post("/adminSignin", adminSignin);
router.get("/getPartnerData",isAdmin, getPartnerData);
router.get('/getPartnerProfile',isAdmin, getPartnerData);
router.patch("/blockPartner",isAdmin, blockPartner);// patch
router.patch("/blockUser",isAdmin, blockUser);// patch
router.get("/partner-approval",isAdmin, partnerApproval);//patch
router.get("/cruise-approval",isAdmin, cruiseApproval);//patch
router.post("/add-category",isAdmin, addCategory);
router.get("/get-categories",isAdmin, getCategories);
router.get("/get-userData",isAdmin, getUserData);
router.get('/cruise-data',isAdmin,getCruiseData)
router.get('/blockCruise',isAdmin,blockCruise)
router.get('/get-notification',isAdmin,getNotification)
router.delete('/delete-notification/:id',isAdmin,deleteNotification)

router.get("/get-bookings",isAdmin, getBookings);

router.get("/getPartnerProfileData",isAdmin, getPartnerProfile);

module.exports = router;
