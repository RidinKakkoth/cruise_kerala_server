const Admin = require('../models/adminModel')
const Partner=require("../models/partnerModel")
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")

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


const createToken=(id)=>{
  
    return  jwt.sign({id:id},"secretCodeforAdmin",{expiresIn:'3d'})
}


const adminSignin=async(req,res)=>{
    
    try {

        let adminLogin={
            status: false,
            token: null,
            name:null
        }

        const{email,password}=req.body
       
    //   const inputError=  inputValidator.loginInputValidator(email,password)
      
    //   if(inputError){
    //     return res.status(400).json({ error: inputError });
    //   }

        const adminData=await Admin.findOne({email:email})

        
        if(!adminData){
            
            return res.status(400).json({ error: "Invalid credentials" });
        }
        
        const match=await bcrypt.compare(password,adminData.password)
       

        if(!match){
            
            return res.status(400).json({ error: "Incorrect password" });
        }
        
        //create token
        let token = createToken(adminData._id);
        adminLogin.token = token;
        adminLogin.status = true;
        adminLogin.name = adminData.email; // Change property name from "AdminName" to "name"     

        
        let obj = {
            token
        };
        
   
        res.cookie("adminCookie", obj, {
          httpOnly: false, 
          maxAge: 6000 * 1000,
          secure:false
        })
          .status(200)
          .send({ adminLogin });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getPartnerData=async (req,res)=>{

  try {

    const token=req.cookies.adminCookie.token
    const jwtToken=jwt.verify(token,"secretCodeforAdmin")

    if(jwtToken){
        Partner.find().then((data)=>{
              res.send(data)
        }).catch((error)=>{
          res.status(500).send({error:error.message})
        })

    }
    
  } catch (error) {
    res.status(401).send({ error: "Unauthorized" });
  }


}



module.exports = { adminSignUP ,adminSignin,getPartnerData};
