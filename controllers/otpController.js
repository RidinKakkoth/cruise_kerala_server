const nodemailer = require("nodemailer");
const User=require("../models/userModel")
const Partner=require("../models/partnerModel")

const OTP_EXPIRATION = 3 * 60 * 1000; // OTP expiration time (5 minutes)

// Function to generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash map to store OTPs and their expiration times
const otpMap = new Map();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send OTP via email
async function sendOTP(req, res) {
  const { email,role } = req.body;
   
if(role==="user"){
  const isExist=await User.findOne({email:email})

   if(isExist){
    return res.status(400).json({ message: "User already exist" });
   }}
if(role==="partner"){
  const isExist=await Partner.findOne({email:email})
   if(isExist){
    return res.status(400).json({ message: "Partner already exist" });
   }}
   

  const otp = generateOTP();

  const mailOptions = {
    from: "brocampproject@gmail.com",
    to: email,
    subject: "OTP Verification",
    html:`<p>Your CRUISE OTP is  <span  style="font-size:24px;font-weight:bold;">  ${otp} </span> .It will expire in 3 minutes, Do not share with others</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({status:false, message: "Failed to send OTP" });
    } else {
      otpMap.set(email, {
        otp: otp,
        expirationTime: Date.now() + OTP_EXPIRATION,
      });
      res.status(200).json({status:true, message: "OTP sent successfully" });
    }
  });
}

// Function to verify OTP
function verifyOTP(req, res) {
  const { email, otp } = req.body;
  const storedOTP = otpMap.get(email);

  if (storedOTP && storedOTP.otp === otp && storedOTP.expirationTime >= Date.now()) {
    // If OTP is valid and not expired
    otpMap.delete(email);
    // Save the user details to the database here
    res.status(200).json({status:true, message: "OTP verified successfully" });
  } else {
    res.status(400).json({status:false, message: "Invalid OTP or OTP expired" });
  }
}

module.exports = { sendOTP, verifyOTP };
