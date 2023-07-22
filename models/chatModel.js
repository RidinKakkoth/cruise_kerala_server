const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    // members: {
    //   type: Array
    // }
   
      adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
      userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model("Chat", chatSchema);
