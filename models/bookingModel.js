const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    total: { type: Number, required: true },
    fee: { type: Number, required: true },
    tax: { type: Number, required: true },
    partnerRevenue: { type: Number, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guest: { type: Number, required: true },
    Discount: { type: Number },
    bookingId:{
        type:String
    },
    orderId: {
        type: String,
        
    }, 
    paymentStatus: {
      type: Boolean,
      default:false
    },
    paymentId: {
      type: String,
    },
    status: {
      type: String,
      default: "Booked",
    },

    cruiseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cruise",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("booking", bookingSchema);
