const Admin = require("../models/adminModel");
const Cruise=require("../models/cruiseModel")
const Partner = require("../models/partnerModel");
const Category = require("../models/categoryModel");
const Coupon = require("../models/couponModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const inputValidator = require("../middleware/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findOneAndDelete } = require("../models/notificationModel");

const adminSignUP = async (req, res) => {
  try {
    const { email, password } = req.body;

    let hashPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      password: hashPassword,
    });

    const added = newAdmin.save();

    res.json({ msg: "successfully added" });
  } catch (error) {
    res.status(400).json({ error: error.msg });
  }
};
//============================ admin signin ======================================================

const createToken = (id) => {
  return jwt.sign({ id: id }, "secretCodeforAdmin", { expiresIn: "3d" });
};

const adminSignin = async (req, res) => {
  try {
    let adminLogin = {
      status: false,
      token: null,
      name: null,
    };

    const { email, password } = req.body;

    try {
      inputValidator.loginInputValidator(email, password);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    const adminData = await Admin.findOne({ email: email });

    if (!adminData) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, adminData.password);

    if (!match) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    //create token
    let token = createToken(adminData._id);
    adminLogin.token = token;
    adminLogin.status = true;
    adminLogin.name = adminData.email; 

    let obj = {
      token,
    };

    res
      .cookie("adminCookie", obj, {
        httpOnly: false,
        maxAge: 6000 * 1000,
        secure: true,
      })
      .status(200)
      .send({ adminLogin, message: "Login Successfull" });
  } catch (error) {
    res.status(400).json({ message: "Error in Login" });
  }
};

//=============================================================================================================================

const getPartnerData = async (req, res) => {
  try {
    Partner.find()
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        res.status(500).send({ error: error.message });
      });

    // }
  } catch (error) {
    res.status(401).send({ error: "Unauthorized" });
  }
};
//=============================================================================================



const blockPartner = async (req, res) => {
  try {
    const partnerId = req.query.id;

    if (!partnerId) {
      return res.status(404).json({ error: "invalid" });
    }
    const partnerData = await Partner.findById(partnerId);

    if (!partnerData) {
      return res.status(404).json({ error: "partner not found" });
    }

    partnerData.isBlocked = !partnerData.isBlocked;
    const updateData = await partnerData.save();

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//======================================================================================================

const blockUser = async (req, res) => {
  try {
    const userId = req.query.id;


    if (!userId) {
      return res.status(404).json({ error: "invalid" });
    }
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ error: "partner not found" });
    }

    userData.isBlocked = !userData.isBlocked;
    const updateData = await userData.save();
  

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//=======================================================================================================
const partnerApproval = async (req, res) => {
  try {

    const partnerId = req.query.id;
    const status = req.query.result;
    

    if (!partnerId) {
      return res.status(404).json({ error: "invalid" });
    }
    const partnerData = await Partner.findById(partnerId);

    if (!partnerData) {
      return res.status(404).json({ error: "partner not found" });
    }
    console.log(status);
    partnerData.isApproved = status;
    const updateData = await partnerData.save();

    res.status(200).json({ status, message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPartnerProfile = async (req, res) => {
  try {
    const partnerId = req.query.id;

    if (!partnerId) {
      return res.status(404).json({ error: "invalid" });
    }
    const partnerData = await Partner.findById(partnerId);

    if (!partnerData) {
      return res.status(404).json({ error: "partner not found" });
    }
    console.log(partnerData);

    res.status(200).json({ partnerData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//================================getbookings data============================

const getBookings = async (req, res) => {
  try {
 
    const bookingData = await Booking.find({ paymentStatus: true })
      .sort({ createdAt: -1 })
      .populate('cruiseId').populate('userId')


    if (bookingData) {
      res.json({ bookingData });
    } else {
      return res.status(404).json({ error: "Booking data not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//=============================================================================================================================

const getUserData = async (req, res) => {
  try {

    User.find()
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        res.status(500).send({ error: error.message });
      });

    // }
  } catch (error) {
    res.status(401).send({ error: "Unauthorized" });
  }
};

const getCruiseData=async(req,res)=>{
  try {


    const data=await Cruise.find().populate("category")

    if(data){
     const categoryData= await Category.find()

     if(!categoryData){
      return res.status(404).json({error:"cruise not found"})
     }
     res.send({data,categoryData})
    }
      
 

} catch (error) {
res.status(401).send({ error: "Unauthorized" });}
}

const getNotification=async(req,res)=>{
  try {
    
    const data=await Notification.find()

     if(!data){
      return res.status(404).json({error:" not found"})
     }
     res.send({data})
    
  } catch (error) {
    res.status(401).send({ error: "Unauthorized" });
  }
}
const getCouponData=async(req,res)=>{
  try {
    
    const data=await Coupon.find()

     if(!data){
      return res.status(404).json({error:" not found"})
     }
     res.send({data})
    
  } catch (error) {
    res.status(401).send({ error: "Unauthorized" });
  }
}
//<========================= getPartnerCruiseData ============================>

const getPartnerCruiseData=async(req,res)=>{
  try {
    const partnerId=req.query.id

    const data=await Cruise.find({partnerId})

     if(!data){
      return res.status(404).json({error:" not found"})
     }
     res.send(data)
    
  } catch (error) {
    res.status(401).send({ error: "Unauthorized" });
  }
}

const deleteNotification = async (req, res) => {
  try {
    const notifId = req.params.id;


    if (notifId) {
      const notification = await Notification.findByIdAndDelete(notifId);
      
      if (notification) {
        return res.json({ message: "Notification deleted successfully." });
      } else {
        return res.status(404).json({ error: "Notification not found." });
      }
    }

    return res.status(400).json({ error: "Notification ID is missing." });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ error: "An error occurred while deleting the notification." });
  }
};
//<====================================== add coupon ===================================>
const addCoupon = async (req, res) => {
  try {
    const {offer,description,discount,couponCode,validFrom,validUpto,userLimit} = req.body;
   
    const existing = await Coupon.find({ couponCode: couponCode });

    if (existing.length > 0) {
      return res.status(400).json({status:false, error: "Coupon already exists" });
    }

    const savedCoupon = await Coupon.create({ offer:offer
      ,description,discount,couponCode,validFrom,validUpto,userLimit});
    res.status(200).json({status:true, message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const blockCoupon = async (req, res) => {
  try {
    const couponId = req.query.id;


    if (!couponId) {
      return res.status(404).json({ error: "invalid" });
    }
    const couponData = await Coupon.findById(couponId);

    if (!couponData) {
      return res.status(404).json({ error: "coupon not found" });
    }

    couponData.isBlock = !couponData.isBlock;
    const updateData = await couponData.save();
  

    res.status(200).json({status:true, message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteCoupon = async (req, res) => {
  try {
    const couponId = req.query.id;

    if (!couponId) {
      return res.status(404).json({ error: "invalid" });
    }
    const couponData = await Coupon.findByIdAndDelete(couponId);

    if (!couponData) {
      return res.status(404).json({ error: "coupon not found" });
    }  

    res.status(200).json({status:true, message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};





module.exports = {
  adminSignUP,
  adminSignin,
  getPartnerData,
  partnerApproval,
  getPartnerCruiseData,
  blockPartner,
  blockUser,
  getPartnerProfile,
  getBookings,
  getUserData,
  getCruiseData,
  getNotification,
  deleteNotification,
  getCouponData,
  addCoupon,
  blockCoupon,
  deleteCoupon
};
