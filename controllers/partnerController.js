const Partner=require('../models/partnerModel')

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


     const newPhone=parseInt(phone,10)

  
      let hashPassword = await bcrypt.hash(password, 10);
  
      const newPartner = new Partner({
        name,
        email,
        password: hashPassword,
        phone:newPhone,
        companyName:company
      });
  
      const added = newPartner.save();
  
      res.json({ msg: "successfully added" });
    } catch (error) {
      res.status(400).json({ error: error.msg });
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
       
    //   const inputError=  inputValidator.loginInputValidator(email,password)
      
    //   if(inputError){
    //     return res.status(400).json({ error: inputError });
    //   }

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

const getPartnerData=async(req,res)=>{
  try {
;
if(!req.cookies||!req.cookies.partnerCookie){
  return res.status(401).json({error:"unAuthorized"});

}

const partnerId=verification(req)

try {

  const partnerData=await Partner.findById(partnerId)

;

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
          partnerData.image=req.file.filename
          const url = req.file.filename
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
  

      partnerData.proof=req.file.filename
      partnerData.isApproved="pending"
      const url = req.file.filename
      await partnerData.save()


      res.status(200).send({success:true,message:"success"})
    }
    else{
      throw new Error ("No image found")
    }


} catch (error) {
res.status(500).json({error:'Internal server error'});
}
}



module.exports={partnerSignUp,partnerSignin,getPartnerData,updateProfilePic,proofUpload}