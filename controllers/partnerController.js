const Partner=require('../models/partnerModel')
const Booking=require('../models/bookingModel')
const Cruise=require('../models/cruiseModel')
const Offer=require('../models/OfferModel')
const Notification=require("../models/notificationModel")
const inputValidator=require("../middleware/validator")
const cloudinary=require("../middleware/cloudinaryConfig")

const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")


const partnerSignUp = async (req, res) => {
    try {
   
      const { name,email,password,phone,company } = req.body;

      try {
        inputValidator.signupInputValidator(name, email, password, phone);
        if(!company){
          throw new Error('Company required');
        }
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
  

     const newPhone=parseInt(phone,10)

  
      let hashPassword = await bcrypt.hash(password, 10);
  
      const newPartner = new Partner({
        name,
        email,
        password: hashPassword,
        phone:newPhone,
        companyName:company
      });
  
      const added = await newPartner.save();
      await Notification.create({
        message:'Partner Joined',
        notification:`New Partner ${added.name} Joined Please check... `,
        status:'success'
      })
  
      res.json({ msg: "successfully added" });
    } catch (error) {
      res.status(400).json({ error: "Signup Error" });
    }
  };


  //=================================== partner signin ============================================

  const createToken=(id)=>{
  
    return  jwt.sign({id:id},"secretCodeforPartner",{expiresIn:'3d'})
}


const partnerSignin=async(req,res)=>{
    
    try {

        let partnerLogin={
            status: false,
            token: null,
            name:null
        }

        const{email,password}=req.body
       
        try {
          inputValidator.loginInputValidator (email, password);
        } catch (error) {
          return res.status(400).json({ error: error.message });
        }

        const partnerData=await Partner.findOne({email:email})

        
        if(!partnerData){
            
            return res.status(400).json({ error: "Invalid credentials" });
        }
        
        const match=await bcrypt.compare(password,partnerData.password)
       

        if(!match){
            
            return res.status(400).json({ error: "Incorrect password" });
        }
        
        //create token
        let token = createToken(partnerData._id);
        partnerLogin.token = token;
        partnerLogin.status = true;
        partnerLogin.name = partnerData.email; // Change property name from "AdminName" to "name"     

        
        let obj = {
            token
        };
        
   
        // res.cookie("partnerCookie", obj, {
        //   httpOnly: false, 
        //   maxAge: 6000 * 1000,
        //   secure:true
        // })
         res.status(200)
          .send({ partnerLogin });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

  //=================================== partner data ============================================


const getPartnerData=async(req,res)=>{
  try {

const partnerId=req.id


try {

  const partnerData=await Partner.findById(partnerId)

  if(!partnerData){
    return res.status(404).json({error:"partner not found"})
  }

  return res.status(200).json({partnerData})

} catch (error) {
  return res.status(500).json({error:"Database error"})
}
    
  } catch (error) {
    return res.status(403).json({error:"Token verification failed"})
  }
}

  //=================================== update partner profile pic ============================================


const updateProfilePic= async(req,res)=>{

  try {
    const partnerId=req.id

        if(!partnerId){
          throw new Error("Invalid Token")
        }

        const partnerData=await Partner.findById(partnerId)

        if(!partnerData){
          throw new Error("User not found")
        }
        if(req.file&&req.file.path){
          const result=await cloudinary.uploader.upload(req.file.path)
          // partnerData.image=req.file.filename
          // const url = req.file.filename
          
          partnerData.image=result. secure_url
          const url = result. secure_url
          await partnerData.save()

  
          res.status(200).send({success:true,url,message:"success"})
        }
        else{
          throw new Error ("No image found")
        }


  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }
}

  //=================================== partner proof upload ============================================


const proofUpload=async(req,res)=>{
  try {

    const partnerId=req.id

    if(!partnerId){
      throw new Error("Invalid Token")
    }

    const partnerData=await Partner.findById(partnerId)

if(!partnerData){
  throw new Error("User not found")
}


if(req.file&&req.file.path){
  
  const result=await cloudinary.uploader.upload(req.file.path)


      // partnerData.proof=req.file.filename
      // const url = req.file.filename
      partnerData.proof=result. secure_url
      const url = result. secure_url
      partnerData.isApproved="pending"
      await partnerData.save()

      await Notification.create({
        message:'Partner Proof uploaded',
        notification:`Partner ${partnerData.name} added proof please verify... `,
        status:'warning'
      })

      res.status(200).send({success:true,message:"success"})
    }
    else{
      throw new Error ("No image found")
    }


} catch (error) {
res.status(500).json({error:'Internal server error'});
}
}

//==========================updateProfile====================================

const updateProfile=async(req,res)=>{
  try {

    const {name,email,companyName,phone}=req.body

    const partnerId=req.id
console.log(partnerId);
    if(!partnerId){
      throw new Error("Invalid Token")
    }
    const partnerData=await Partner.findById(partnerId)

    if(!partnerData){
      throw new Error("Partner not found")
    }

    partnerData.name=name
    partnerData.email=email
    partnerData.phone=phone
    partnerData.companyName=companyName

    await partnerData.save()
    await Notification.create({
      message:'Partner profile updated',
      notification:`Partner ${partnerData.name} profile updated `,
      status:'warning'
    })
    res.status(200).send({success:true,message:"success"})
    

  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }
}

//================================getbookings data============================

const getBookings = async (req, res) => {
  try {

    const partnerId = req.id;
    
    const bookingData = await Booking.find({ paymentStatus: true })
      .populate('cruiseId').populate("userId");
    
    const data = bookingData.filter((value) => {
      const cruisePartnerId = value.cruiseId.partnerId.toString(); // Convert ObjectId to string
      const requestedPartnerId = partnerId.toString(); // Convert ObjectId to string
      if (cruisePartnerId === requestedPartnerId) {
        return true;
      }
      return false;
    });
    

    if (data) {
      res.json({ data });
    } else {
      return res.status(404).json({ error: "Booking data not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const emailValid = async (req, res) => {
  try {
    const email = req.query.email;

    const partnerExist = await Partner.findOne({ email });

    if (partnerExist) {
      return res.json({ status: true });
    } else {
     return res.json({ status: false });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetPass = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;
  
    let hashPassword = await bcrypt.hash(password, 10);

    const partnerExist = await Partner.findOne({ email });

    if (!partnerExist) {
      throw new Error("User not found")
    } else {
      partnerExist.password=hashPassword
      partnerExist.save()
     return res.json({ status: true });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
//<==================================== get single cruise data ==================================>

const getSingleCruiseData=async(req,res)=>{
  try {
    const id=req.query.id
    const data=await Cruise.findById({_id:id}).populate("category")
    res.send({data})
    
  } catch (error) {
    res.status(401).send({ error: "Unauthorized" });
  }
}
//<==================================== add offer ==================================>

const addOffer = async (req, res) => {
  try {
    const {offerName,cruiseId,description,percentage,startDate,endDate} = req.body;
    const partnerId=req.id
    
    const existing = await Offer.find({ offerName: offerName,cruiseId:cruiseId })
    if (existing.length > 0) {
      return res.status(400).json({status:false, error: "offer already exists" });
    }
    
    const savedCoupon = await Offer.create({offerName,cruiseId,description,percentage,startDate,endDate,partnerId});
    res.status(200).json({status:true, message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//<==================================== get offer ==================================>
const getOffer=async(req,res)=>{
  try {
    
    const partnerId=req.id
    
    const data=await Offer.find({partnerId:partnerId}).populate("cruiseId")
    
    if(!data){
      return res.status(404).json({error:" not found"})
    }
    res.send({data})
    
  } catch (error) {
    res.status(401).send({ error: "Unauthorized" });
  }
}
//<==================================== block offer ==================================>

const blockOffer = async (req, res) => {
  try {
    const offerId = req.query.id;
    
    if (!offerId) {
      return res.status(404).json({ error: "invalid" });
    }
    const offerData = await Offer.findById(offerId);

    if (!offerData) {
      return res.status(404).json({ error: "offer not found" });
    }

    offerData.isBlock = !offerData.isBlock;
    const updateData = await offerData.save();
  

    res.status(200).json({status:true, message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteOffer = async (req, res) => {
  try {
    const offerId = req.query.id;

    if (!offerId) {
      return res.status(404).json({ error: "invalid" });
    }
    const offerData = await Offer.findByIdAndDelete(offerId);

    if (!offerData) {
      return res.status(404).json({ error: "coupon not found" });
    }  

    res.status(200).json({status:true, message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//<==================================== cancel booking ==================================>
const cancelBooking=async(req,res)=>{
  try {

    const bookingId=req.query.id


    const bookingData=await Booking.findById(bookingId)
    if(!bookingData){
      return res.status(404).json({error:"booking not found"})
    }
    bookingData.status="Cancelled"
    bookingData.save()
    res.status(200).json({ bookingData });
  } catch (error) {
    console.log(error);
  }
}


module.exports={partnerSignUp,resetPass,getSingleCruiseData,cancelBooking,emailValid,getBookings,partnerSignin,getPartnerData,updateProfilePic,proofUpload,updateProfile,addOffer,getOffer,blockOffer,deleteOffer}