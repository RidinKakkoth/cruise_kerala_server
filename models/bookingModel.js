const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    total: { type: Number, required: true },
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
    isCancel: {
      type: Boolean,
      default: false,
    },

    cruiseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "partner",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("booking", bookingSchema);
