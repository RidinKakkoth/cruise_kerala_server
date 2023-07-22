const Admin=require('../models/adminModel')
const User=require('../models/userModel')
const Partner=require('../models/partnerModel')
const jwt = require("jsonwebtoken");


const isAdmin =async (req, res, next) => {
  try {

    const jwtToken = req.cookies.adminCookie.token;
    const decodedToken = jwt.verify(jwtToken, "secretCodeforAdmin");
    const adminId = decodedToken.id;

    const isFound=await Admin.findById(adminId).select('-password')


    if (isFound) {
      next(); 
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};


const isPartner =async (req, res, next) => {
  try {

   
    const jwtToken = req.cookies.partnerCookie.token;
    const decodedToken = jwt.verify(jwtToken, "secretCodeforPartner");
    const partnerId = decodedToken.id;


    const isFound=await Partner.findById(partnerId).select('-password')

    if (isFound) {
      next(); 
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};



const isUser =async (req, res, next) => {
  try {

    
    const jwtToken = req.cookies.userCookie.token;
    const decodedToken = jwt.verify(jwtToken, "secretCodeforUser");
    const userId = decodedToken.id;
    
    
    const isFound=await User.findById(userId).select('-password')
    
    if (isFound) {


      next(); 
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports= {isAdmin,isUser,isPartner}
