const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const PartnerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true, unique: true },
  proof: { type: String },
  isBlocked: { type: Boolean,default:true },
  district: { type: String },
  image: { type: String },
  isApproved: { type: Boolean,default:true },
});

module.exports = mongoose.model("Partner", PartnerSchema);


