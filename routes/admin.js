const express = require("express");
const {isAdmin}=require('../middleware/authentication')
const router = express.Router();

const {
  adminSignUP,
  adminSignin,
  getPartnerData,
  blockPartner,
  partnerApproval,
  getPartnerProfile,
} = require("../controllers/adminController");
const {
  cruiseApproval,
  addCategory,
  getCategories,
} = require("../controllers/cruiseController");

router.post("/adminSignUp", adminSignUP);
router.post("/adminSignin", adminSignin);
router.get("/getPartnerData",isAdmin, getPartnerData);
router.patch("/blockPartner",isAdmin, blockPartner);
router.patch("/partner-approval",isAdmin, partnerApproval);
router.patch("/cruise-approval",isAdmin, cruiseApproval);
router.post("/add-category",isAdmin, addCategory);
router.get("/get-categories",isAdmin, getCategories);

router.get("/getPartnerProfileData",isAdmin, getPartnerProfile);

module.exports = router;
