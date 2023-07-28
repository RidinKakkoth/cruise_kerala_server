const mongoose=require("mongoose")
const couponSchema=new mongoose.Schema({
    offer:{
        type:String,
        required:true
    },
    couponCode:{
        type:String,
        required:true
    },
    percentage:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    validFrom:{
        type:Date,
        required:true
    },
    validUpto:{
        type:Date,
        required:true
    },
    userLimit:{
        type:Number,
        required:true
    },
    isBlock:{
        type:Boolean,
        default:false
    }


},{timestamps:true})

module.exports=mongoose.model("Coupon",couponSchema)