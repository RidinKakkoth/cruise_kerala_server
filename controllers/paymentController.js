const Razorpay = require("razorpay");
const crypto = require('crypto');
const jwt=require("jsonwebtoken");
const bookingModel = require("../models/bookingModel");

const verification=(req)=>{
  const jwtToken=req.cookies.userCookie.token

  const decodedToken=jwt.verify(jwtToken,"secretCodeforUser")

  const userId=decodedToken.id

  return userId
}






const orderCreate = async (req, res) => {

try {

  const userId=verification(req)

  const{totalAmount,guest,cruiseId,checkInDate,checkOutDate}=req.body
  console.log(req.body);

  const guestNum=parseInt(guest)


  let instance = new Razorpay({ key_id: process.env.RZP_KEY_ID, key_secret:  process.env.RZP_KEY_SECRET })

const options = {
  amount: totalAmount*100,  // amount in the smallest currency unit
  currency: "INR",
  receipt: crypto.randomBytes(10).toString("hex"),
};

 instance.orders.create(options,(error,order)=>{
  if(error){
    console.log(error);
    return res.status(500).json("something  went wrong!")
  }
 
console.log(cruiseId,"ddddddddddddd");
  const newBooking=new bookingModel({
    total:totalAmount,
    checkIn:checkInDate,
    checkOut:checkOutDate,
    cruiseId,
    guest:guestNum,
    userId,
    bookingId:order.id

  })

  const bookedData=newBooking.save()

  res.status(200).json({data:order,bookedData})
 }) 

} catch (error) {
  console.log(error);
}

};




const verify = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RZP_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const bookingData = await bookingModel.findOne({ bookingId: razorpay_order_id });

      if (!bookingData) {
        return res.status(404).json({ message: "Booking not found" });
      }

      bookingData.paymentStatus = true;
      bookingData.paymentId = razorpay_payment_id;

      const bookedData = await bookingData.save();

      return res.status(200).json({ message: "Payment verified", bookedData });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};


  module.exports={orderCreate,verify}