const Partner=require('../models/partnerModel')
const Booking=require('../models/bookingModel')
const Cruise=require('../models/cruiseModel')
const Notification=require("../models/notificationModel")
const inputValidator=require("../middleware/validator")
const cloudinary=require("../middleware/cloudinaryConfig")

const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")
// SECRET=process.env.PARTNER_SECRET_KEY

const verification=(req)=>{
  const jwtToken=req.cookies.partnerCookie.token

  const decodedToken=jwt.verify(jwtToken,"secretCodeforPartner")

  const partnerId=decodedToken.id

  return partnerId
}

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
        
   
        res.cookie("partnerCookie", obj, {
          httpOnly: false, 
          maxAge: 6000 * 1000,
          secure:false
        })
          .status(200)
          .send({ partnerLogin });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

  //=================================== partner data ============================================


const getPartnerData=async(req,res)=>{
  try {

const partnerId=verification(req)

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
    const partnerId=verification(req)

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

    const partnerId=verification(req)

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
    

    const partnerId=verification(req)

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

    const partnerId=verification(req)

    const bookingData = await Booking.find({ paymentStatus: true })
      .populate('cruiseId').populate("userId")
const data=await bookingData.filter((value)=>{
 return value.cruiseId.partnerId.toHexString()===partnerId
})




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
console.log(req.query);
    const id=req.query.id
console.log(id);
    const data=await Cruise.findById({_id:id}).populate("category")
 console.log(data);
     res.send({data})

} catch (error) {
res.status(401).send({ error: "Unauthorized" });
}
}


module.exports={partnerSignUp,resetPass,getSingleCruiseData,emailValid,getBookings,partnerSignin,getPartnerData,updateProfilePic,proofUpload,updateProfile}