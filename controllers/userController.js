const User=require('../models/userModel')
const Booking=require('../models/bookingModel')
const Cruise=require('../models/cruiseModel')
const inputValidator=require("../middleware/validator")

const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const bookingModel = require('../models/bookingModel');

const cloudinary=require("../middleware/cloudinaryConfig")


// SECRET=process.env.USER_SECRET_KEY

const verification=(req)=>{
  const jwtToken=req.cookies.userCookie.token

  const decodedToken=jwt.verify(jwtToken,"secretCodeforUser")

  const userId=decodedToken.id

  return userId
}

  //============================================================================================


const userSignUp = async (req, res) => {
    try {

      const { name,email,password,phone } = req.body;


      try {
        inputValidator.signupInputValidator(name, email, password, phone);
      } catch (error) {
 
        return res.status(400).json({ error: error.message });
      }
  
     const newPhone=parseInt(phone,10)

     const isExist=await User.findOne({email:email})
     if(isExist){
      return res.status(400).json({ error: "User already exist" });
     }
  
      let hashPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashPassword,
        phone:newPhone,
        isVerified:true

      });
  
      const added = newUser.save();
  
      res.status(200).json({ msg: "successfully added" });
    } catch (error) {
      res.status(400).json({ error: "Signup Error" });
    }
  };



  
  //=================================== partner signin ============================================

  const createToken=(id)=>{
  
    return  jwt.sign({id:id},"secretCodeforUser",{expiresIn:'3d'})
}


const userSignin=async(req,res)=>{
    
    try {

        let userLogin={
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

        const userData=await User.findOne({email:email})

        
        if(!userData){
            
            return res.status(400).json({ error: "Invalid credentials" });
        }
        
        const match=await bcrypt.compare(password,userData.password)
       

        if(!match){
            
            return res.status(400).json({ error: "Incorrect password" });
        }
        
        //create token
        let token = createToken(userData._id);
        userLogin.token = token;
        userLogin.status = true;
        userLogin.name = userData.name; //    

        
        let obj = {
            token,
            userName:userData.name
        };
        
   
        res.cookie("userCookie", obj, {
          httpOnly: false, 
          maxAge: 6000 * 1000,
          secure:false
        })
          .status(200)
          .send({ userLogin });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

//============================================================================================

const userData=async(req,res)=>{
  try {
    
    if(!req.cookies||!req.cookies.userCookie){
      return res.status(401).json({error:"unAuthorized"});
      
    }
    
    const userId=verification(req)

    try {
    
      const userData=await User.findById(userId)
    
      if(!userData){
        return res.status(404).json({error:"partner not found"})
      }
    
      return res.status(200).json({userData})
    
    } catch (error) {
      return res.status(500).json({error:"Database error"})
    }
        
      } catch (error) {
        return res.status(403).json({error:"Token verification failed"})
      }
    }


//================================getbookings data============================

const getBookings = async (req, res) => {
  try {
    const userId = verification(req);

    const bookingData = await Booking.find({
      userId: userId,
      paymentStatus: 'true'
    }).sort({ createdAt: -1 }).populate('cruiseId');
    
    

    if (bookingData) {
      res.json({ bookingData });
    } else {
      return res.status(404).json({ error: "Booking data not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const bookedDates=async (req,res)=>{
  try {

    const cruiseId=req.query.id


    const currentDate = new Date();
    
    const bookingDataDates = await Booking.find( {cruiseId: cruiseId},  'checkIn checkOut');

    if(bookingDataDates){
      res.json(bookingDataDates)
    }else {
      return res.status(404).json({ error: " no data" });
    }

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

const addReview=async(req,res)=>{
  try {

    const userId=verification(req)
    const{star,feedback,cruiseId}=req.body
    
    const cruiseData=await Cruise.findById(cruiseId)

    if(!cruiseData){
      return res.status(404).json({error:"cruise not found"})
    }
    
    const review = {
      ratings: parseInt(star),
      feedback: feedback,
      userId: userId,
    };

    cruiseData.review.push(review);

    await cruiseData.save().then(()=>{
      return res.json()
    })

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
//==========================updateProfile====================================

const updateProfile=async(req,res)=>{
  try {

    const {userName,email,phone}=req.body
  
    const userId=verification(req)

    if(!userId){
      throw new Error("Invalid Token")
    }
    const userData=await User.findById(userId)

    if(!userData){
      throw new Error("Partner not found")
    }

    userData.name=userName
    userData.email=email
    userData.phone=phone


    await userData.save()
    res.status(200).send({success:true,message:"success"})
    

  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }
}

//<================================ profile pic update ================================>


const updateProfilePic= async(req,res)=>{
  try {
    
    const userId=verification(req)
    
    
    const userData=await User.findById(userId)
    
    if(!userData){
      throw new Error("User not found")
    }
    if(req.file&&req.file.path){

     const result=await cloudinary.uploader.upload(req.file.path)
      
      // userData.image=req.file.filename
      // const url = req.file.filename
      const url = result. secure_url
      userData.image=result. secure_url
          await userData.save()

  
          res.status(200).send({success:true,url,message:"success"})
        }
        else{
          throw new Error ("No image found")
        }


  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }
}
//===========================================================================

const emailValid = async (req, res) => {
  try {
    const email = req.query.email;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.json({ status: true });
    } else {
     return res.json({ status: false });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
//===========================================================================

const resetPass = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;
    let hashPassword = await bcrypt.hash(password, 10);

    const userExist = await User.findOne({ email });

    if (!userExist) {
      throw new Error("User not found")
    } else {
      userExist.password=hashPassword
      userExist.save()
     return res.json({ status: true });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




module.exports={userSignUp,userSignin,userData,getBookings,bookedDates,addReview,updateProfile,updateProfilePic,emailValid,resetPass}