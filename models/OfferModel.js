const mongoose = require("mongoose");
const offerSchema = new mongoose.Schema(
  {
    offerName: {
      type: String,
      required: true,
    },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    percentage: { type: Number, required: true },
    isBlock: {
      type: Boolean,
      default: false,
    },
    cruiseId: { type: mongoose.Schema.Types.ObjectId, ref: "Cruise" },
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
