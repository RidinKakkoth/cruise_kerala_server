const User=require('../models/usererModel ')
const inputValidator=require("../middleware/validator")

const bcrypt = require("bcrypt");



const userSignUp = async (req, res) => {
    try {
   console.log(req.body,"dddddddddddddddd");
      const { name,email,password,phone } = req.body;
      console.log(name);

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
  
      res.json({ msg: "successfully added" });
    } catch (error) {
      res.status(400).json({ error: "Signup Error" });
    }
  };




module.exports={userSignUp}