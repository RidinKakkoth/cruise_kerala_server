const mongoose = require("mongoose");



const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true, unique: true },
  proof: { type: String },
  isBlocked: { type: Boolean,default:false },
  district: { type: String },
  image: { type: String },
  isApproved: { type: Boolean,default:false },
});

module.exports = mongoose.model("Partner", PartnerSchema);


