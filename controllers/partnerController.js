const Partner=require('../models/partnerModel')

const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")


const partnerSignUp = async (req, res) => {
    try {
      const { name,email,password,phone,companyName } = req.body;
  
      let hashPassword = await bcrypt.hash(password, 10);
  
      const newPartner = new Partner({
        name,
        email,
        password: hashPassword,
        phone,
        companyName
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

module.exports={partnerSignUp,partnerSignin}