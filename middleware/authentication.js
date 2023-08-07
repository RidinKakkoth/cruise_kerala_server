const Admin=require('../models/adminModel')
const User=require('../models/userModel')
const Partner=require('../models/partnerModel')
const jwt = require("jsonwebtoken");


const isAdmin =async (req, res, next) => {
  try {
    
    const jwtToken = req.headers.authorization?.split(' ')[1];
    // const jwtToken = req.cookies.adminCookie;

    const decodedToken = jwt.verify(jwtToken, process.env.ADMIN_SECRET_KEY);
    const adminId = decodedToken.id;

    const isFound=await Admin.findById(adminId).select('-password')


    if (isFound) {
      req.id=isFound._id
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

   
    const jwtToken = req.headers.authorization?.split(' ')[1];
console.log(jwtToken);
    // const jwtToken = req.cookies.partnerCookie;
    const decodedToken = jwt.verify(jwtToken, process.env.PARTNER_SECRET_KEY);
    const partnerId = decodedToken.id;


    const isFound=await Partner.findById(partnerId).select('-password')

    if (isFound) {
      req.id=isFound._id
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
    
      const authorizationHeader = req.headers.authorization;

const jwtToken = authorizationHeader.replace('Bearer ', '');
    const decodedToken = jwt.verify(jwtToken, process.env.USER_SECRET_KEY);
    const userId = decodedToken.id;
  
    
    const isFound=await User.findById(userId).select('-password')
    if (isFound) {
      req.id=isFound._id
      next(); 
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports= {isAdmin,isUser,isPartner}
