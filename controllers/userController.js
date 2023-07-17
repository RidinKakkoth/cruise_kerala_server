const User=require('../models/usererModel ')
const Booking=require('../models/bookingModel')
const inputValidator=require("../middleware/validator")

const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")


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

  
      let hashPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashPassword,
        phone:newPhone,

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
    }).populate('cruiseId');
    

    if (bookingData) {
      res.json({ bookingData });
    } else {
      return res.status(404).json({ error: "Booking data not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

    


module.exports={userSignUp,userSignin,userData,getBookings}