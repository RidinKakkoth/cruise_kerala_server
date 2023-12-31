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
  getPartnerProfile,getPartnerCruiseData,getBookings,getUserData,blockUser,getNotification,deleteNotification,getCouponData,blockCoupon,deleteCoupon,addCoupon
} = require("../controllers/adminController");
const {
  cruiseApproval,
  addCategory,
  getCategories,blockCruise,editCategory
} = require("../controllers/cruiseController");
const{findAdminChats}=require("../controllers/chatController")


router.post("/adminSignUp", adminSignUP);
router.post("/adminSignin", adminSignin);

router.get("/getPartnerData",isAdmin, getPartnerData);
router.get('/getPartnerProfile',isAdmin, getPartnerData);
router.get("/getPartnerProfileData",isAdmin, getPartnerProfile);
router.get("/partner-cruise-data",isAdmin, getPartnerCruiseData);
router.patch("/blockPartner",isAdmin, blockPartner);
router.patch("/partner-approval",isAdmin, partnerApproval);

router.patch("/blockUser",isAdmin, blockUser);
router.get("/get-userData",isAdmin, getUserData);

router.get('/cruise-data',isAdmin,getCruiseData)
router.patch("/cruise-approval",isAdmin, cruiseApproval);
router.patch('/blockCruise',isAdmin,blockCruise)
router.get("/get-bookings",isAdmin, getBookings);

router.post("/add-category",isAdmin, addCategory);
router.patch("/edit-category/:id",isAdmin, editCategory);
router.get("/get-categories",isAdmin, getCategories);

router.get('/get-notification',isAdmin,getNotification)
router.delete('/delete-notification/:id',isAdmin,deleteNotification)

router.post("/add-coupon",isAdmin, addCoupon);
router.get("/get-coupon-data",isAdmin, getCouponData);
router.patch("/blockCoupon",isAdmin, blockCoupon);
router.patch("/delete-coupon",isAdmin, deleteCoupon);

router.get("/adminChat",isAdmin,findAdminChats)

module.exports = router;
